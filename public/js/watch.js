'use strict';

var groupMap = {};
var groupID = null;
var names = new Set();

// Wait until DOM loads
$(document).ready(function() {
	getGroups();

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
  	var checkbox = $(this)[0];
  	if (checkbox.checked) {
  		editGroups(checkbox.value, true);
  	} else {
  		editGroups(checkbox.value, false);
  	}
	});
});

function editGroups(name, show) {
	for (var id in groupMap) {
		var group = groupMap[id];
		var viewers = group.viewers;
		for (let i = 0; i < viewers.length; i++) {
			if (viewers[i].name === name) {
				show ? $('#'+id).show() : $('#'+id).hide();
				break;
			}
		}
	}
}

function addGroupsToDom(name) {
	for (var id in groupMap) {
		var group = groupMap[id];
		var viewers = group.viewers;
		for (let i = 0; i < viewers.length; i++) {
			if (viewers[i].name === name) {
				$('#'+id).show();
			}
		}
	}
}

function renderNames() {
	names.forEach(function(name) {
		var nameComponent = renderNameComponent(name);
		$('#names').append(nameComponent);
	});
}

function renderNameComponent(name) {
	var component =
		'<label class="checkbox-inline">' +
	    '<input type="checkbox" id="inlineCheckbox1" value="' + name + '" checked>' + name +
	  '</label>';
	return component;
}

function getGroups() {
	$.get('/api/groups')
	  .done(function(res) {
	    renderGroups(res.groups);
	    renderNames();
	  })
	  .fail(function(error) {
	    console.log(error);
	  });
}


function renderGroups(groups) {
	for (let i = 0; i < groups.length; i++) {
		var group = renderGroup(groups[i]);
		$('#groups').append(group);
	}
}

function renderGroup(group) {
	groupMap[group._id] = group;
	var names = parseNames(group.viewers);
	var group =
		'<div class="row">' +
	    '<div class="col-xs-12 text-center tile" data-toggle="modal" data-target=".bs-example-modal-sm" ' 
	    	+ 'id="' + group._id + '" ' + '>' +
	      '<div class="tile-content">' +
	        '<h4>' + group.content.title + '</h4>' +
	        '<h5>' + names + '</h5>' +
	      '</div>' +
	    '</div>' +
	  '</div>';
	return group;
}

function parseNames(viewers) {
	var str = '';
	for (let i = 0; i < viewers.length; i++) {
		str += viewers[i].name + ' ';
		names.add(viewers[i].name);
	}
	return str;
}
