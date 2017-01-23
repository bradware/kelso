'use strict';

// Wait until DOM loads
$(document).ready(function() {
	var email = $('#email');
	var password = $('#password');
	var submitBtn = $('#submit-btn');
	var purple = '#727DF0';
	var green = '#5ACBAD';

	$('input').blur(function(e) {
		if (email.val() && password.val()) {
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
		var req = {};
		req.email = email.val();
		req.password = password.val();
		$.post('/api/login', req)
			.done(function(res) {
				if (res.redirect) {
					document.location.href = res.redirect;
				}
			})
			.fail(function(error) {
				alert(error.responseText);
			});
	});
});