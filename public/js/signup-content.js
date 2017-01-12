'use strict';

// Wait until DOM loads
$(document).ready(function() {
  var submitBtn = $('#submit-btn');
	var tile = $('.tile');
  var titles = new Set();
  var contentTitle = null;

  getModal();

  tile.click(function(e) {
    contentTitle = e.currentTarget.children[0].children[0].innerHTML;
    $('#modal-title')[0].innerText = 'I watch ' + contentTitle + ' with...';
  });

  $('#save').click(function() {
    var obj = {};
    obj.contentTitle = contentTitle;
    var checkboxes = $('input:checkbox');
    var names = [];
    for (let i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked) {
        names.push(checkboxes[i].labels[0].innerText);
      }
    }
    obj.names = names;
    $.post('/api/group', obj)
      .done(function(res) {
        console.log(res);
        if (res.redirect) {
          document.location.href = res.redirect;
        }
      })
      .fail(function(error) {
        console.log(error);
      });
    clearCheckboxes();
  });

  $('#cancel').click(function() {
    clearCheckboxes();
  });

});

function clearCheckboxes() {
  var checkboxes = $('input:checkbox');
  var names = [];
  for (let i = 0; i < checkboxes.length; i++) {
    checkboxes[i].checked = false;
  }
}


function getModal() {
  $.get('/api/viewer/content')
    .done(function(res) {
      updateModalDom(res);
    })
    .fail(function(error) {
      console.log(error);
    });
}

function updateModalDom(arr) {
  for (let i = 0; i < arr.length; i++) {
    var modalComponent = getModalComponent(arr[i].name);
    $('.modal-body').append(modalComponent);
  }
}

function getModalComponent(name) {
  var component = 
    '<div class="checkbox">' +
      '<label>' +
        '<input type="checkbox">' + name + 
      '</label>' +
    '</div>';
  return component;
}



