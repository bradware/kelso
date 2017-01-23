'use strict';

var viewerMap = {};

// Wait until DOM loads
$(document).ready(function() {
	var submitBtn = $('#submit-btn');
	var tile = $('.tile');
	var titles = new Set();
	var contentTitle = null;

	getModal();

	tile.click(function(e) {
		contentTitle = e.currentTarget.children[0].children[0].innerHTML;
		$('#modal-title')[0].innerText = 'Who watches ' + contentTitle + '?';
	});

	$('#save').click(function() {
		var obj = {};
		obj.contentTitle = contentTitle;
		var checkboxes = $('input:checkbox');
		var ids = [];
		for (let i = 0; i < checkboxes.length; i++) {
			if (checkboxes[i].checked) {
				ids.push(viewerMap[checkboxes[i].labels[0].innerText]);
			}
		}
		obj.ids = ids;
		$.post('/api/viewer/content', obj)
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
	$.get('/api/viewers')
		.done(function(res) {
			updateModalDom(res);
			updateViewerMap(res);
		})
		.fail(function(error) {
			console.log(error);
		});
}

function updateViewerMap(arr) {
	for (let i = 0; i < arr.length; i++) {
		viewerMap[arr[i].name] = arr[i]._id;
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
