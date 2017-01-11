'use strict';

// Wait until DOM loads
$(document).ready(function() {
	var submitBtn = $('#submit-btn');
	var members = $('#members');
  var addMember = $('#add-member');
  

  addMember.click(function() {
  	var emptyEmail = checkEmails();
  	if (!emptyEmail) {
  		var memberComponent = getMemberComponent();
  		members.prepend(memberComponent);
  	}
  });

  submitBtn.click(function() {
  	var emails = grabEmails();
  	var obj = {};
  	obj.emails = emails;
  	$.post('/api/group', obj)
  		.done(function(res) {
  			if (res.redirect) {
    			document.location.href = res.redirect;
				}
  		})
  		.fail(function(error) {
  			console.log(error);
  		});
  });

  $('input').keypress(function(e) {
    var emptyEmail = checkEmails();
  	if (!emptyEmail) {
  		submitBtn.prop('disabled', false);
  	} else {
  		submitBtn.prop('disabled', true);
  	}
  });
});

function getMemberComponent() {
	var content = 
		'<div class="form-group member">' +
			'<label for="email">Email</label>' +
			'<input type="email" class="form-control" id="email" placeholder="Email">' + 
		'</div>';
	return content;
}

function checkEmails() {
	var emails = $('input');
	var emptyEmail = false;
	for (let i = 0; i < emails.length; i++) {
		if (emails[i].value.length === 0) {
			return true;
		}
	}
	return false;
}

function grabEmails() {
	var emails = $('input');
	var emailList = [];
	for (let i = 0; i < emails.length; i++) {
		emailList.push(emails[i].value);
	}

	return emailList;
}