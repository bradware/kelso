'use strict';

var contents = null;
var viewers = null;
var recommended = null;
var viewingMap = null; // built after API cal
var contentMap = null; // built after API cal
var viewerMap = {};

// Wait until DOM loads
$(document).ready(function() {
	$.get('/api/content/all')
		.done(function(res) {
			contents = res;
			contentMap = buildMap(contents);
			console.log(contents);
		})
		.fail(function(error) {
			console.log(error);
		});

	$.get('/api/content/rec')
		.done(function(res) {
			recommended = res;
			console.log(recommended);
			getContentResults(recommended);
		})
		.fail(function(error) {
			console.log(error);
		});

	$.get('/api/viewers')
		.done(function(res) {
			viewers = res;
			viewingMap = buildMap(viewers);
			updateModalDom(viewers);
			console.log(viewers);
		})
		.fail(function(error) {
			console.log(error);
		});

	$(document).on('keydown', 'input', function(e) {
		$('#content-results').empty();
		if ($(this)[0].value.length > 2) {
			getContentResults(searchContents($(this)[0].value));
		}
	});	

	$('.tile').click(function(e) {
		
	});

	$('#save').click(function() {
		clearCheckboxes();
	});

	$('#cancel').click(function() {
		clearCheckboxes();
	});

});

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
	var results = [];
	for (let i = 0; i < contents.length; i++) {
		if (contents[i].title.toLowerCase().match(str.toLowerCase())) {
			results.push(contents[i]);
		}
	}
	return results;
}

function buildTooltip() {
	
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
