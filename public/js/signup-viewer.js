'use strict';

// Wait until DOM loads
$(document).ready(function() {
	var submitBtn = $('#submit-btn');
	var firstName = $('#first-name');
	var lastName = $('#last-name');
	var email = $('#email');
	var password = $('#password');
	var age = $('#age');
	var female = $('#female');
	var male = $('#male');

	$('input').keypress(function(e) {
    if (firstName.val() && lastName.val() && email.val() && email.val().includes('@') 
    	&& password.val() && handleAge(age.val())) {
       submitBtn.prop('disabled', false);
    } else {
    	submitBtn.prop('disabled', true);
    }
  });

  submitBtn.click(function() {
  	var viewer = {};
  	viewer.first_name = firstName.val().trim();
  	viewer.last_name = lastName.val().trim();
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
