'use strict';

// Wait until DOM loads
$(document).ready(function() {
  var submitBtn = $('#submit-btn');
  var name = $('#name');
  var email = $('#email');
  var password = $('#password');
  var age = $('#age');
  var female = $('#female');
  var male = $('#male');

  $('input').blur(function(e) {
    if (name.val() && email.val() && password.val() && handleAge(age.val())) {
      submitBtn.prop('disabled', false);
      submitBtn.addClass('green');
      submitBtn.removeClass('purple');
    } else {
      submitBtn.prop('disabled', true);
      submitBtn.addClass('purple');
      submitBtn.removeClass('green');
    }
  });

  submitBtn.click(function() {
    var viewer = {};
    viewer.name = name.val().trim();
    viewer.email = email.val().trim();
    viewer.password = password.val().trim();
    viewer.age = age.val().trim();
    viewer.gender = male.is(':checked') ? 'MALE' : 'FEMALE';

    $.post('/api/register', viewer)
      .done(function(res) {
        if (res.redirect) {
          document.location.href = res.redirect;
        }
      })
      .fail(function(error) {
        console.log(error);
      });
  });
});

function handleAge(age) {
  if (isNum(age)) {
    return true;
  } else {
    return false;
  }
}

/**
* Utility method to check if the string passed is a number
*/
function isNum(num) {
  return !isNaN(parseFloat(num.trim())) && isFinite(num.trim());
}
