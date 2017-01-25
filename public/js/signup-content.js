'use strict';

var contents = null;
var recommended = null;
var viewers = null;
var viewingMap = null; // built after API call
var contentMap = null; // built after API call
var viewerMap = {};

// Wait until DOM loads
$(document).ready(function() {
	$('#tooltip').hide();

	$.get('/api/content/all')
		.done(function(res) {
			contents = res.contents;
			contentMap = buildMap(contents);
			getContentResults(contents);
			
			$('.tile').hide();
			
			recommended = res.recs;
			showRecommendedResults(recommended);
		})
		.fail(function(error) {
			console.log(error);
		});

	$.get('/api/viewers')
		.done(function(res) {
			viewers = res;
			viewingMap = buildMap(viewers);
			$('#content-results').prepend(getTooltip(viewers));
			$('#tooltip').hide();
		})
		.fail(function(error) {
			console.log(error);
		});

	$(document).on('keydown', 'input', function(e) {
		$('.tile').hide();
		if ($(this)[0].value.length === 0) {
			showRecommendedResults(recommended);
		} else if ($(this)[0].value.length > 1) {
			searchContents($(this)[0].value);
		}
	});	
	
	$(document).on('click', 'body', function(e) {
		if ($(e.target).hasClass('tile')) {
			$('#tooltip').fadeIn().css(({left: e.pageX, top: e.pageY - 50}));
		} else {
			$('#tooltip').fadeOut();
		}
	});

	$('#save').click(function() {
		clearCheckboxes();
	});

	$('#cancel').click(function() {
		clearCheckboxes();
	});

});

function getTooltip(arr) {
	var start = '<div id="tooltip"><h4 class="text-center">Who?</h4>';
	var middle = '';
	var end = '</div>';
	for (let i = 0; i < arr.length; i++) {
		middle += renderTooltipContent(arr[i]);
	}
	return start + middle + end;
}

function renderTooltipContent(viewer) {
	var start = '<div class="checkbox"><label>';
	var middle = '<input type="checkbox" id="' + viewer._id + 'value="' + viewer.name + '">' + viewer.name;
	var end = '</label></div>';
	return start + middle + end;
}

function showRecommendedResults(recs) {
	for (let i = 0; i < recs.length; i++) {
		$('#'+recs[i]._id).show();
	}
}

function buildMap(arr) {
	var map = {};
	for (let i = 0; i < arr.length; i++) {
		map[arr[i]._id] = arr[i];
	}
	return map;
}

function getContentResults(arr) {
	for (let i = 0; i < arr.length; i++) {
		var renderedResult = renderContentResult(arr[i]);
		$('#content-results').append(renderedResult);
	}
}

function renderContentResult(res) {
	var content =
		'<div class="col-xs-6 text-center tile" id="' + res._id + '">' +
			'<div class="tile-content">' +
				'<h4>' + res.title +'</h4>' +
			'</div>' +
		'</div>';
	return content;
}

function searchContents(str) {
	for (let i = 0; i < contents.length; i++) {
		if (contents[i].title.toLowerCase().match(str.toLowerCase())) {
			$('#'+contents[i]._id).show();
		}
	}
}

function clearCheckboxes() {
	var checkboxes = $('input:checkbox');
	var names = [];
	for (let i = 0; i < checkboxes.length; i++) {
		checkboxes[i].checked = false;
	}
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
