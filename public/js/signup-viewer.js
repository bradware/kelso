'use strict';

// Wait until DOM loads
$(document).ready(function() {  
  $('#add-member').click(function() {
    if (!emptyInput()) {
      var memberComponent = getMemberComponent();
      $('#members').append(memberComponent);
      updateGreen();
      $('#submit-btn').prop('disabled', true);
    }
  });

  $('#submit-btn').click(function() {
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

  $(document).on('blur', 'input', function(e) {
    validateDom();
  });

  $(document).on('click', '.x-icon', function(e) {
    $(this)[0].parentElement.remove();
    validateDom();
  });
});

function getMemberComponent() {
  var content = 
    '<div class="member">' +
      '<i class="fa fa-times x-icon"></i>' +
      '<form>' +
        '<div class="form-group">' +
          '<label for="name">name</label>' +
          '<input type="text" class="form-control name" placeholder="Jane" required>' +
        '</div>' +
        '<div class="form-group">' +
          '<label for="email">email</label>' +
          '<input type="email" class="form-control email" placeholder="jane.doe@gmail.com" required>' +
        '</div>' +
      '</form>' +
    '</div>';
  return content;
}

function validateDom() {
  if ($('input').length === 0) {
    updatePurple();
    $('#submit-btn').prop('disabled', false);
  } else if (!emptyInput()) {
    updateGreen();
    $('#submit-btn').prop('disabled', false);
  } else {
    updateGreen();
    $('#submit-btn').prop('disabled', true);
  }
}

function updateGreen() {
  $('#submit-btn').addClass('green');
  $('#submit-btn').removeClass('purple');
  $('#submit-btn').html('next');
}

function updatePurple() {
  $('#submit-btn').addClass('purple');
  $('#submit-btn').removeClass('green');
  $('#submit-btn').html('skip');
}

function emptyInput() {
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
    if (fields[i].value.length > 0 && fields[i+1].value.length > 0) {
      obj.name = fields[i].value;
      obj.email = fields[i+1].value;
      arr.push(obj);
    }
  }
  return arr;
}