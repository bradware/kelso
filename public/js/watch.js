'use strict';

var viewer = null;
var contentID = null;

var otherViewers = {};
var contentMap = {};

// Wait until DOM loads
$(document).ready(function() {
  getContentTiles();
  getWatchModal();

  $(document).on('click', '.tile', function(e) { 
    contentID = $(e.target).closest('.tile')[0].id;

    $('.tile').css('background-color', '#2C2F3D');
    $('#'+contentID).css('background-color', '#727DF0');
    
    var centerX = ($(window).width() / 2) - (($('#watch-modal').width() / 2) + 15);
    var centerY = ($(window).height() / 2) - (($('#watch-modal').height() / 2) - 15);
    $('#watch-modal').find('h4')[0].innerHTML = 'Watching ' + contentMap[contentID].title + '?';
    $('#watch-modal').fadeIn().css(({left: centerX, top: centerY}));
  });

  $(document).on('click', 'html', function(e) { 
    if ($(e.target).hasClass('tile') || $(e.target).parents('.tile').length > 0 || 
        $(e.target).parents('#watch-modal').length > 0 || $(e.target).is('#watch-modal')) {
      return;
    } else {
      $('#watch-modal').fadeOut();
      $('.tile').css('background-color', '#2C2F3D');
    }
  });

  $(document).on('click', '#cancel-btn', function(e) {
    $('#watch-modal').fadeOut();
    $('.tile').css('background-color', '#2C2F3D');
  });

  $(document).on('click', '#watch-btn', function() {
    $('#watch-modal').fadeOut();
    
    var obj = {};
    obj.viewer = createViewerSmall(viewer);
    obj.content = createContentSmall();
    obj.other_viewers = [];
    var otherViewersChecked = getOtherViewersChecked();
    for (let i = 0; i < otherViewersChecked.length; i++) {
      obj.other_viewers.push(createViewerSmall(otherViewers[otherViewersChecked[i]]));
    }
    
    $.post('/api/tracker', obj)
      .done(function(res) {
        if (res.redirect) {
          document.location.href = res.redirect;
        }
      })
      .fail(function(error) {
        console.log(error);
      });
  });

  $(document).on('click', 'input:checkbox', function(e) { 
    var otherViewersChecked = getOtherViewersChecked();
    if (otherViewersChecked.length === 0) {
      var contentDom = viewer.content;
    } else {
      var contentDom = findIntersection(otherViewersChecked);
    }
    $('#content-results').empty();
    renderContentResults(contentDom);
  });
});

function getContentTiles() {
  $.get('/api/viewers')
    .done(function(res) {
      setGlobals(res);
      renderContentResults(viewer.content);
      renderNames();
      $('#content-results').css('background-color', '#1D1F29');
      $('body').prepend(getWatchModal());
      $('#watch-modal').hide();
    })
    .fail(function(error) {
      console.log(error);
    });
}

function setGlobals(res) {
  viewer = res[0];
  for (let i = 1; i < res.length; i++) {
    otherViewers[res[i]._id] = res[i];
  }
}

function getOtherViewersChecked() {
  var otherViewersChecked = [];
  var checkboxes = $('input:checkbox');
  for (let i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked) {
      otherViewersChecked.push(checkboxes[i].id);
    }
  }
  return otherViewersChecked;
}

function createContentSmall() {
  var contentSmall = {};
  contentSmall._id = contentID;
  contentSmall.title = contentMap[contentID].title;
  return contentSmall;
}

function createViewerSmall(viewer) {
  var otherViewer = {};
  otherViewer._id = viewer._id;
  otherViewer.name = viewer.name;
  otherViewer.email = viewer.email;
  return otherViewer;
}

function findIntersection(otherViewersChecked) {
  var newContentDom = [];
  for (let i = 0; i < viewer.content.length; i++) {
    var currContent = viewer.content[i];
    var found = findIntersectionOtherViewers(currContent, otherViewersChecked);
    if (found === otherViewersChecked.length) {
      newContentDom.push(currContent);
    }
  }
  return newContentDom;
}
 
function findIntersectionOtherViewers(currContent, otherViewersChecked) {
  var found = 0;
  for (let j = 0; j < otherViewersChecked.length; j++) {
    var otherViewer = otherViewers[otherViewersChecked[j]];
    for (let k = 0; k < otherViewer.content.length; k++) {
      if (otherViewer.content[k]._id === currContent._id) {
        found++;
        break;
      }
    }
  }
  return found;
}

function renderNames() {
  for (var id in otherViewers) {
    var nameComponent = renderNameComponent(otherViewers[id]);
    $('#viewers').append(nameComponent);
  }
}

function renderNameComponent(otherViewer) {
  var id = otherViewer._id;
  var name = otherViewer.name;
  var component =
    '<label class="checkbox-inline light-gray-font">' +
      '<input type="checkbox" id="' + id + '" value="' + name + '">' + name +
    '</label>';
  return component;
}

function renderContentResults(arr) {
  for (let i = 0; i < arr.length; i++) {
    contentMap[arr[i]._id] = arr[i];
    $('#content-results').append(renderContentResult(arr[i]));
  }
  $('.tile-content').css('margin-top', '55px');
}

function renderContentResult(res) {
  var content =
    '<div class="col-xs-6 text-center tile medium-gray" id="' + res._id + '">' +
      '<div class="tile-content">' +
        '<h4>' + res.title +'</h4>' +
      '</div>' +
    '</div>';
  return content;
}

function getWatchModal() {
  var content =
    '<div id="watch-modal" class="text-center">' +
      '<h4></h4>' +
      '<button id="cancel-btn" type="button" class="btn purple-font modal-btn ">nah</button>' +
      '<button id="watch-btn" type="button" class="btn green-font modal-btn ">yeah</button>' +
    '</div>';
  return content;
}
