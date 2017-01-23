'use strict';

var viewerMap = {};
var contentTitle = null;
var viewer = null;

// Wait until DOM loads
$(document).ready(function() {
	$('.tile').click(function(e) {
		contentTitle = e.currentTarget.children[0].children[0].innerHTML;
		$('#modal-title')[0].innerText = 'You watch ' + contentTitle + '?';
	});

	$('#save-btn').click(function() {
		var obj = {};
		obj.contentTitle = contentTitle;
		obj.ids = [ ];
		obj.ids.push(viewer._id);
		
		$.post('/api/viewer/content', obj)
			.fail(function(error) {
				console.log(error);
			});
	});

	$.get('/api/viewer')
			.then(function(res) {
				viewer = res;
			})
			.fail(function(error) {
				console.log(error);
			});

});