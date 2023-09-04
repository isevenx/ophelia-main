document.addEventListener("DOMContentLoaded", function () {
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
});
document.addEventListener("DOMContentLoaded", function () {
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
});
$("#token-amount").on("change", function () {
  tokenInput = $(this);
  tokenAmount = tokenInput.val().replace(/[^0-9]/g, "");
  tokenAmount = parseInt(tokenAmount);
  tokenCount = $("#token-count").text();
  tokenCount = parseInt(tokenCount);
  if (tokenAmount > tokenCount) {
    $("#wf-form-submit-ticket input[type=submit], form[name=gift-form] input[type=submit]")
      .prop("disabled", true)
      .addClass("disabled");
    tokenInput.val("0");
    $(".credit-calc").html(
      "You don't have enough credits. <a href='https://hiophelia.com/members/buy-credits'>Purchase more</a>"
    );
  } else {
    $("#wf-form-submit-ticket input[type=submit], form[name=gift-form] input[type=submit]")
      .prop("disabled", false)
      .removeClass("disabled");
    credit_calc = tokenAmount * 1.56;
    credit_calc = parseFloat(credit_calc).toFixed(2);
    $(".credit-calc").text("equal to $" + credit_calc + " USD");
  }
  if (tokenAmount <= 24) {
    $("#wf-form-submit-ticket input[type=submit]")
      .prop("disabled", true)
      .addClass("disabled");
    tokenInput.val("0");
    $(".credit-calc").text("Please enter at least 25 credits");
  }
});
checkUrl();
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
      $("#first-time").show();
    }

    // Find all the immediate child divs of the element with an ID of featured-pro.
    var pros = $("#featured-pro > div");

    // Randomize the order of the divs.
    pros.sort(function () {
      return Math.random() - 0.5;
    });

    // Remove all the divs except for the first one.
    pros.slice(1).remove();

    // Get the URL input field.
    var screenRecURL = document.getElementById("screen-recording");
    var projectLink = document.getElementById("project-link");

    // Set up an event listener for the input field's `change` event.
    screenRecURL.addEventListener("change", function () {
      // Get the value of the input field.
      var url = screenRecURL.value;

      // Check if the value matches the regular expression.
      if (!validateURL(url)) {
        // Display an error message.
        alert("The URL must start with https://");
      }
    });

    // Set up an event listener for the input field's `change` event.
    projectLink.addEventListener("change", function () {
      // Get the value of the input field.
      var url = projectLink.value;

      // Check if the value matches the regular expression.
      if (!validateURL(url)) {
        // Display an error message.
        alert("The URL must start with https://");
      }
    });
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

$(".action-button.solve").click(function () {
  $(".main--content").animate(
    {
      scrollTop: $("#solve-table").offset().top
    },
    750
  );
});
$(".action-button.solution").click(function () {
  $(".main--content").animate(
    {
      scrollTop: $("#solution-row").offset().top
    },
    750
  );
});

window.addEventListener("load", checkUrl);

$("#ticket-table").hide();
$(document).ready(function () {
  var cid = $("#cid").text();

  $("#payout-id").val(cid);

  $(".tickets-cl > div").each(function () {
    var card = $(this);
    if (card.attr("client-id") !== cid) {
      card.remove();
    } else {
      card.show();
    }
  });

  $("#ticket-table").show();
});

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

// Get the submit button
var submitButton = $(".form-button");

// Get all of the input fields in the form
var inputFields = $(".wh-form input");

// When any input field is changed, check if the form is completely filled out
inputFields.on("input", function () {
  // Check if all of the input fields have a value
  var isFormFilledOut = true;
  inputFields.each(function () {
    if ($(this).val() === "") {
      isFormFilledOut = false;
      return false;
    }
  });

  // When the form is submitted, disable the submit button
  $(".wh-form").submit(function () {
    // If the form is filled out, disable the submit button
    if (isFormFilledOut) {
      submitButton
        .prop("disabled", true)
        .addClass("disabled")
        .val("Please wait...");
    } else {
      submitButton
        .prop("disabled", false)
        .removeClass("disabled")
        .val("Submit ticket");
    }
  });
});
