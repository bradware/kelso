'use strict';

var viewer = null;
var otherViewers = {};
var contentTitle = null;
var contentID = null;

// Wait until DOM loads
$(document).ready(function() {
  getContentTiles();

  $(document).on('click', '.tile', function(e) { 
    contentTitle = e.currentTarget.children[0].children[0].innerHTML;
    contentID = e.currentTarget.id;
    $('#modal-title')[0].innerText = 'Watch ' + contentTitle + ' ?';
  });

  $('#watch-btn').click(function() {
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
    $('#contents').empty();
    renderContentTiles(contentDom);
  });
});

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
  contentSmall.title = contentTitle;
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
    $('#names').append(nameComponent);
  }
}

function renderNameComponent(otherViewer) {
  var id = otherViewer._id;
  var name = otherViewer.name;
  var component =
    '<label class="checkbox-inline">' +
      '<input type="checkbox" id="' + id + '" value="' + name + '">' + name +
    '</label>';
  return component;
}

function getContentTiles() {
  $.get('/api/viewer/content')
    .done(function(res) {
      setGlobals(res);
      renderContentTiles(viewer.content);
      renderNames();
    })
    .fail(function(error) {
      console.log(error);
    });
}

function renderContentTiles(contentDom) {
  for (let i = 0; i < contentDom.length; i++) {
    var contentTile = renderContentTile(contentDom[i]);
    $('#contents').append(contentTile);
  }
}

function renderContentTile(content) {
  var content =
    '<div class="row">' +
      '<div class="col-xs-12 text-center tile" data-toggle="modal" data-target=".bs-example-modal-sm" ' 
        + 'id="' + content._id + '" ' + '>' +
        '<div class="tile-content">' +
          '<h4>' + content.title + '</h4>' +
        '</div>' +
      '</div>' +
    '</div>';
  return content;
}

function setGlobals(res) {
  viewer = res.viewer;
  for (let i = 0; i < res.other_viewers.length; i++) {
    otherViewers[res.other_viewers[i]._id] = res.other_viewers[i];
  }
}
