'use strict';

// Wait until DOM loads
$(document).ready(function() {
	var submitBtn = $('#submit-btn');
	var members = $('#members');
  var addMember = $('#add-member');
  

  addMember.click(function() {
  	var emptyInput = checkInput();
  	if (!emptyInput) {
  		var memberComponent = getMemberComponent();
  		members.append(memberComponent);
  	}
  });

  submitBtn.click(function() {
    var obj = {};
    obj.viewers = grabInput();
  	$.post('/api/viewer', obj)
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
    var emptyInput = checkInput();
  	if (!emptyInput) {
  		submitBtn.prop('disabled', false);
  	} else {
  		submitBtn.prop('disabled', true);
  	}
  });
});

function getMemberComponent() {
	var content = 
		'<div class="member">' +
      '<div class="form-group">' + 
        '<label for="name">Name</label>' + 
        '<input type="text" class="form-control" id="name" placeholder="Name" required>' + 
      '</div>' + 
      '<div class="form-group">' + 
        '<label for="name">Email</label>' + 
        '<input type="email" class="form-control" id="email" placeholder="Email" required>' + 
      '</div>' + 
		'</div>';
	return content;
}

function checkInput() {
	var input = $('input');
	var emptyInput = false;
	for (let i = 0; i < input.length; i++) {
		if (input[i].value.length === 0) {
			return true;
		}
	}
	return false;
}

function grabInput() {
  var fields = $('input').find().prevObject;
  var arr = [];
  for (let i = 0; i < fields.length - 1; i += 2) {
    var obj = {};
    obj.name = fields[i].value;
    obj.email = fields[i+1].value;
    arr.push(obj);
  }

  return arr;
}