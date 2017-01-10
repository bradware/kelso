'use strict';

// Wait until DOM loads
$(document).ready(function() {
	var members = $('#members');
  var addMember = $('#add-member');


  addMember.click(function() {
  	var memberComponent = getMemberComponent();
  	members.prepend(memberComponent);
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