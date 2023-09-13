//ophelia v0.1.5

const tokensConfig = {
    MINIMUM_TICKET_CREDITS: 25,
    TICKET_VALUE_MULTIPLAYER: 1.56
  };
  
  function checkUrl() {
    // Get the current URL.
    const url = window.location.href;
    // Check if the URL contains the /members/dashboard path.
    if (url.indexOf("/members/dashboard") > -1) {
      // first-timer
  
      $("#first-time-dismiss").on("click", function () {
        Cookies.set("ftu", "dismissed", { expires: 350 });
        $("#first-time").remove();
      });
  
      if (typeof Cookies.get("ftu") !== "undefined") {
        $("#first-time").remove();
      } else {
        $("#first-time").css("display", "flex");
      }
  
      // Find all the immediate child divs of the element with an ID of featured-pro.
      var pros = $("#featured-pro > div");
  
      // Randomize the order of the divs.
      pros.sort(function () {
        return Math.random() - 0.5;
      });
  
      // Remove all the divs except for the first one.
      pros.slice(1).remove();
    }
  
    if (url.indexOf("/pro/cash-out") > -1) {
      const payoutTokensInput = document.getElementById("payout-tokens");
      const tokenCountInput = document.getElementById("token-count");
  
      const isPayoutTokensMultipleOf10 = () => {
        const payoutTokensValue = payoutTokensInput.value;
        if (!payoutTokensValue || isNaN(payoutTokensValue)) {
          return false;
        }
  
        return payoutTokensValue % 10 === 0;
      };
  
      const isTokenCountGreaterThanOrEqualToPayoutTokens = () => {
        const tokenCountValue = Number(tokenCountInput.value);
        const payoutTokensValue = payoutTokensInput.value;
  
        if (
          !tokenCountValue ||
          !payoutTokensValue ||
          isNaN(tokenCountValue) ||
          isNaN(payoutTokensValue)
        ) {
          return false;
        }
  
        return tokenCountValue >= payoutTokensValue;
      };
  
      payoutTokensInput.addEventListener("change", () => {
        const isPayoutTokensValid = isPayoutTokensMultipleOf10();
        payoutTokensInput.setCustomValidity(
          isPayoutTokensValid ? "" : "Payout tokens must be a multiple of 10"
        );
      });
  
      tokenCountInput.addEventListener("change", () => {
        const isTokenCountValid = isTokenCountGreaterThanOrEqualToPayoutTokens();
        tokenCountInput.setCustomValidity(
          isTokenCountValid
            ? ""
            : "Token count must be greater than or equal to payout tokens"
        );
      });
    }
  }
  
  function memberStackLoader() {
    // Get the `_ms-mem` object from the local storage
    const msMem = JSON.parse(localStorage.getItem("_ms-mem"));
  
    // Get all the elements that have the `ms-code-customfield` attribute
    const elements = document.querySelectorAll("[ms-code-customfield]");
  
    // Iterate over each element
    elements.forEach((element) => {
      // Get the value of the `ms-code-customfield` attribute
      const customField = element.getAttribute("ms-code-customfield");
  
      // If customField starts with '!', we invert the logic
      if (customField.startsWith("!")) {
        const actualCustomField = customField.slice(1); // remove the '!' from the start
  
        // If the custom field is empty, remove the element from the DOM
        if (msMem.customFields && msMem.customFields[actualCustomField]) {
          element.parentNode.removeChild(element);
        }
      } else {
        // Check if the user has the corresponding custom field in Memberstack
        if (!msMem.customFields || !msMem.customFields[customField]) {
          // If the custom field is empty, remove the element from the DOM
          element.parentNode.removeChild(element);
        }
      }
    });
  
    // Parse member data from local storage
    const memberData = JSON.parse(localStorage.getItem("_ms-mem") || "{}");
  
    // Check if the user is logged in
    if (memberData && memberData.id) {
      // Get custom fields
      const customFields = memberData.customFields;
  
      // Select all elements with 'ms-code-field-link' attribute
      const elements = document.querySelectorAll("[ms-code-field-link]");
  
      // Iterate over all selected elements
      elements.forEach((element) => {
        // Get custom field key from 'ms-code-field-link' attribute
        const fieldKey = element.getAttribute("ms-code-field-link");
  
        // If key exists in custom fields
        if (customFields.hasOwnProperty(fieldKey)) {
          // Get the custom field value
          const fieldValue = customFields[fieldKey];
  
          // Check if the custom field value is empty
          if (fieldValue.trim() === "") {
            // Set the element to display none
            element.style.display = "none";
          } else {
            // Check if the link has a protocol, if not, add http://
            let link = fieldValue;
            if (!/^https?:\/\//i.test(link)) {
              link = "http://" + link;
            }
  
            // Set the element href to the corresponding value
            element.setAttribute("href", link);
          }
        } else {
          // Set the element to display none if the custom field key doesn't exist
          element.style.display = "none";
        }
      });
    }
  }
  
  function getTicketValue() {
    var ticketValue = $("#token-amount").val();
    ticketValue = parseInt(ticketValue);
    return ticketValue;
  }
  
  function getGiftValue() {
    var giftValue = $("#credits").val();
    giftValue = parseInt(giftValue);
    return giftValue;
  }
  
  checkUrl();
  
  document.addEventListener("DOMContentLoaded", function () {
    memberStackLoader();
  });
  
  window.addEventListener("load", checkUrl);
  
  // hide pro tickets
  $("#ticket-table, #pro-tickets").hide();
  
  // new ticket -> token input onChange
  $("#token-amount").on("change", function () {
    tokenInput = $(this);
    tokenAmount = getTicketValue();
    tokenInput.val(tokenAmount);
    tokenCount = $("#token-count").text();
    tokenCount = parseInt(tokenCount);
    if (tokenAmount < 0) return;
    if (tokenAmount < tokensConfig.MINIMUM_TICKET_CREDITS) {
      $("#wf-form-submit-ticket input[type=submit]")
        .prop("disabled", true)
        .addClass("disabled");
      tokenInput.val("0");
      $(".credit-calc").text("Please enter at least 25 credits");
    }
    if (tokenAmount > tokenCount) {
      $("#wf-form-submit-ticket input[type=submit]")
        .prop("disabled", true)
        .addClass("disabled");
      tokenInput.val("0");
      $(".credit-calc").html(
        "You don't have enough credits. <a href='https://hiophelia.com/members/buy-credits'>Purchase more</a>"
      );
    } else {
      $("#wf-form-submit-ticket input[type=submit]")
        .prop("disabled", false)
        .removeClass("disabled");
      credit_calc = tokenAmount * tokensConfig.TICKET_VALUE_MULTIPLAYER;
      credit_calc = parseFloat(credit_calc).toFixed(2);
      $(".credit-calc").text("equal to $" + credit_calc + " USD");
    }
  });
  
  // solve ticket animation
  $(".action-button.solve").click(function () {
    $(".main--content").animate(
      {
        scrollTop: $("#solve-table").offset().top
      },
      750
    );
  });
  
  // solution button animation
  $(".action-button.solution").click(function () {
    $(".main--content").animate(
      {
        scrollTop: $("#solution-row").offset().top
      },
      750
    );
  });
  
  // grab MS member id
  var cid = $("#cid").text();
  $("#payout-id").val(cid);
  
  // hide pro tickets
  $("#ticket-table .tickets-cl > div").each(function () {
    var card = $(this);
    if (card.attr("client-id") !== cid) {
      card.remove();
    } else {
      card.show();
    }
  });
  $("#pro-tickets .tickets-cl > div").each(function () {
    var card = $(this);
    if (card.attr("helper-id") !== cid) {
      card.remove();
    } else {
      card.show();
    }
  });
  
  $("#ticket-table, #pro-tickets").show();
  
  // notifications
  const urlParams = new URLSearchParams(window.location.search);
  const msg = urlParams.get("msg");
  if (msg !== null) {
    console.log(msg);
    $(".messages-wrapper").show();
    $("#msg-" + msg).show();
    setTimeout(() => {
      $(".messages-wrapper").fadeOut(500, () => {
        $(".messages-wrapper").hide();
        $("#msg-" + msg).hide();
      });
    }, 5000);
  }
  
  // ticket table
  $("#tt-all").on("click", function (evt) {
    $(".ticket-table--tab-link").removeClass("current");
    $(this).addClass("current");
    $("#w-tabs-0-data-w-tab-0").triggerHandler("click");
    evt.preventDefault();
  });
  $("#tt-open").on("click", function (evt) {
    $(".ticket-table--tab-link").removeClass("current");
    $(this).addClass("current");
    $("#w-tabs-0-data-w-tab-1").triggerHandler("click");
    evt.preventDefault();
  });
  $("#tt-ip").on("click", function (evt) {
    $(".ticket-table--tab-link").removeClass("current");
    $(this).addClass("current");
    $("#w-tabs-0-data-w-tab-2").triggerHandler("click");
    evt.preventDefault();
  });
  $("#tt-solved").on("click", function (evt) {
    $(".ticket-table--tab-link").removeClass("current");
    $(this).addClass("current");
    $("#w-tabs-0-data-w-tab-3").triggerHandler("click");
    evt.preventDefault();
  });
  
  // ticket submit form
  var submitButton = $(".wh-form .form-button");
  // Get all of the input fields in the form
  var inputFields = $(".wh-form input");
  
  // When any input field is changed, check if the form is completely filled out
  inputFields.on("input", function () {
    // Check if all of the input fields have a value
    const isFormFilledOut = Array.from(inputFields).every(
      (input) => input.value !== ""
    );
  
    // disable submit button if the form is not filled out
    if (isFormFilledOut) {
      submitButton.prop("disabled", false).removeClass("disabled");
    } else {
      submitButton.prop("disabled", true).addClass("disabled");
    }
    $(".wh-form").submit(function (e) {
      e.preventDefault();
      const form = $(this);
      const thisForm = this;
      thisForm.checkValidity();
      // check if the form is filled out
      const isFormFilledOut = Array.from(inputFields).every(
        (input) => input.value !== ""
      );
      // check if ticket value is greater than 25
      const isTicketValueGreaterThanOrEqualToMinimum =
        getTicketValue() >= tokensConfig.MINIMUM_TICKET_CREDITS;
  
      if (isFormFilledOut && isTicketValueGreaterThanOrEqualToMinimum) {
        submitButton
          .prop("disabled", true)
          .addClass("disabled")
          .val("Please wait...");
        form.submit();
      }
    });
  });
  
  // gift
  var giftButton = $("#gift-submit");
  // Get all of the input fields in the form
  var giftFields = $("#wf-form-gift-form input");
  
  // When any input field is changed, check if the form is completely filled out
  giftFields.on("input", function () {
    const isFormFilledOut = Array.from(giftFields).every(
      (input) => input.value !== ""
    );
    // disable submit button if the form is not filled out
    if (isFormFilledOut) {
      giftButton.prop("disabled", false).removeClass("disabled");
    } else {
      giftButton.prop("disabled", true).addClass("disabled");
    }
  });
  
  // When the form is submitted, disable the submit button
  $("#wf-form-gift-form").submit(function (e) {
    e.preventDefault();
    const form = $(this);
    // check if the form is filled out
    const isFormFilledOut = Array.from(giftFields).every(
      (input) => input.value !== ""
    );
    // check if credits are above 0
    const isCreditsAboveZero = getGiftValue() > 0;
    if (isFormFilledOut && isCreditsAboveZero) {
      giftButton
        .prop("disabled", true)
        .addClass("disabled")
        .val("Please wait...");
      form.submit();
    }
  });
  
  // lowercase email input in the send gift form
  var emailInput = $("#email-2");
  emailInput.keyup(function () {
    $(this).val($(this).val().toLowerCase());
  });
  
  // update ticket submit form inputs to be of type url
  $("#solution-video, #resource-link, #screen-recording, #project-link").attr(
    "type",
    "url"
  );
  
  // update ticket submit form inputs to be of type url
  $("#screen-recording").on("blur", function () {
    const field = this;
    const errorMessage = "Incorrect URL - should be Loom video link";
    try {
      const url = new URL(field.value);
      if (!url.origin.endsWith("loom.com")) {
        field.setCustomValidity(errorMessage);
        throw new Error(errorMessage);
      }
      field.setCustomValidity("");
    } catch (error) {
      field.setCustomValidity(errorMessage);
    }
  });
  
  $("#project-link").on("blur", function () {
    const field = this;
    const errorMessage = "Incorrect URL - should be Webflow preview link";
    try {
      const url = new URL(field.value);
      if (!url.origin.endsWith("preview.webflow.com")) {
        field.setCustomValidity(errorMessage);
        throw new Error(errorMessage);
      }
      field.setCustomValidity("");
    } catch (error) {
      field.setCustomValidity(errorMessage);
    }
  });
  