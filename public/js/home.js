'use strict';

// Wait until DOM loads
$(document).ready(function() {
	var submitBtn = $('#submit-btn');
	
  submitBtn.click(function() {
    console.log('in here');
  	$.get('/api/logout')
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
