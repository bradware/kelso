'use strict';

var viewer = null;
var otherViewers = {};

// Wait until DOM loads
$(document).ready(function() {
	getContentTiles();

	$(document).on('click', '.tile', function(e) { 
  	var div = e.currentTarget.children[0];
  	var contentTitle = div.children[0].innerHTML;
  	var names = div.children[1].innerHTML.trim().split(' ');
  	groupID = e.currentTarget.id
  	$('#modal-title')[0].innerText = 'Watching ' + contentTitle + ' with \n' + names + '?';
	});

	$('#watch').click(function() {
		var obj = {};
    obj.group = groupMap[groupID];
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
		var otherViewersChecked = [];
  	var checkboxes = $('input:checkbox');
  	var anyChecked = false;
  	for (let i = 0; i < checkboxes.length; i++) {
  		if (checkboxes[i].checked) {
  			otherViewersChecked.push(checkboxes[i].id);
  			anyChecked = true;
  		}
  	}

  	if (!anyChecked) {
  		var contentDom = viewer.content;
  	} else {
  		var contentDom = findIntersection(otherViewersChecked);
  	}

  	$('#contents').empty();
  	renderContentTiles(contentDom);
	});
});

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
