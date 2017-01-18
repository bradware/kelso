'use strict';

// Wait until DOM loads
$(document).ready(function() {  
  $('#add-member').click(function() {
  	var emptyInput = checkInput();
  	if (!emptyInput) {
  		var memberComponent = getMemberComponent();
  		$('#members').append(memberComponent);
  	}
    $('#submit-btn').prop('disabled', true);
  });

  $('#submit-btn').click(function() {
    var obj = {};
    obj.viewers = grabInput();
    console.log(obj);
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

  $(document).on('blur', 'input', function(e) {
    validateDom();
  });

  $(document).on('click', '.fa-times', function(e) {
    $(this)[0].parentElement.remove();
    validateDom();
  });
});

function getMemberComponent() {
	var content = 
		'<div class="member">' +
      '<i class="fa fa-times"></i>' +
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

function validateDom() {
  var emptyInput = checkInput();
  if (!emptyInput) {
    $('#submit-btn').prop('disabled', false);
  } else {
    $('#submit-btn').prop('disabled', true);
  }
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