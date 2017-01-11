'use strict';

// Wait until DOM loads
$(document).ready(function() {
  var email = $('#email');
  var password = $('#password');
	var submitBtn = $('#submit-btn');

  $('input').keypress(function(e) {
    if (email.val() && password.val()) {
       submitBtn.prop('disabled', false);
    } else {
      submitBtn.prop('disabled', true);
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
  			console.log(error);
  		});
  });
});