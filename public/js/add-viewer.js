'use strict';

var otherViewers = null;

// Wait until DOM loads
$(document).ready(function() {
  $.get('/api/viewer')
    .done(function(res) {
      otherViewers = res.other_viewers;
      getOtherViewersComponent();
    })
    .fail(function(error) {
      console.log(error);
    });

  $('#submit-btn').click(function(e) {
    if (e.target.innerText === 'done') {
      var obj = {};
      obj.otherViewers = otherViewers;
      $.ajax({
        url: '/api/viewer/other-viewers',
        type: 'PUT',
        data: obj,
        success: function(res) {
          if (res.redirect) {
            document.location.href = res.redirect;
          }
        },
        error: function(err) {
          console.log(err);
        }
      });
    } else {
      var newOtherViewer = grabInput();
      if (newOtherViewer) {
        otherViewers.push(newOtherViewer);
        updatePurple();
        $('#other-viewers').append(renderOtherViewerComponent(newOtherViewer));
      }
      $('input').val(''); // clear input
    }
  });

  $(document).on('blur', 'input', function(e) {
    validateDom();
  });

  $(document).on('click', '.remove-other-viewer', function(e) {
    $(this)[0].parentElement.remove();
    var email = $(this)[0].parentElement.id;
    for (let i = 0; i < otherViewers.length; i++) {
      if (otherViewers[i].email === email) {
        otherViewers.splice(i, 1);
      }
    }
  });
});

function getOtherViewersComponent() {
  for (let i = 0; i < otherViewers.length; i++) {
    $('#other-viewers').append(renderOtherViewerComponent(otherViewers[i]));
  }
}

function renderOtherViewerComponent(otherViewer) {
  var content =
    '<div class="other-viewer col-xs-6" id="' + otherViewer.email + '">' +
      '<h4 class="other-viewer-title">' + otherViewer.name + '</h4>' +
      '<i class="fa fa-times x-icon remove-other-viewer"></i>' +
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
  $('#submit-btn').html('save');
}

function updatePurple() {
  $('#submit-btn').addClass('purple');
  $('#submit-btn').removeClass('green');
  $('#submit-btn').html('done');
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

function clearInput() {
  var input = $('input').val('');
}

function grabInput() {
  var fields = $('input').find().prevObject;
  for (let i = 0; i < fields.length - 1; i += 2) {
    if (fields[i].value.length > 0 && fields[i+1].value.length > 0) {
      var obj = {};
      obj.name = fields[i].value;
      obj.email = fields[i+1].value;
      return obj;
    }
  }
  return null;
}
