'use strict';

// Wait until DOM loads
$(document).ready(function() {
  $.get('/api/groups')
    .done(function(res) {
      renderGroups(res.groups);
    })
    .fail(function(error) {
      console.log(error);
    });
});

function renderGroups(groups) {
	for (let i = 0; i < groups.length; i++) {
		var group = renderGroup(groups[i]);
		$('#groups').append(group);
	}
}

function renderGroup(group) {
	var names = parseNames(group.viewers);
	var group =
		'<div class="row">' +
	    '<div class="col-xs-12 text-center tile">' +
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
		console.log(viewers[i].name);
		str += viewers[i].name + ' ';
	}
	return str;
}