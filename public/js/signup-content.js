'use strict';

// lists
var contents = null;
var recommended = null;
var viewers = null;

// data map for API POST
var contentViewerMap = {}; 

// helper maps
var contentMap = null; // built after API call
var viewerMap = null; // built after API call

// curr tile selected
var currTile = null;

// Wait until DOM loads
$(document).ready(function() {
	initDataAndDom();

	$(document).on('keydown', 'input', function(e) {
		$('.tile').hide();
		if ($(this)[0].value.length === 0) {
			showRecommendedResults(recommended);
		} else if ($(this)[0].value.length > 1) {
			searchContents($(this)[0].value);
		}
	});	
	
	// click touchend
	$(document).on('click', '.tile', function(e) {
		console.log('in here');
		if ($('#tooltip').is(':visible') && currTile === e.target.id) {
			return;
		} else {
			if (!currTile) {
				console.log($(e.target).closest('.tile')[0].id);
				currTile = $(e.target).closest('.tile')[0].id;
			}
			saveContentViewers(currTile, getCheckboxes());
			currTile = $(e.target).closest('.tile')[0].id;
			$('#tooltip').fadeIn().css(({left: e.pageX - 50, top: e.pageY - 75}));
			populateCheckboxes();
		}
	});

	// click touchend
	$(document).on('click', 'body', function(e) {
		if ($(e.target).hasClass('tile') || $(e.target).parents('.tile').length > 0 || 
			$(e.target).parents('#tooltip').length > 0) {
			return;
		} else {
			if (currTile) {
				saveContentViewers(currTile, getCheckboxes());
			}
			$('#tooltip').fadeOut();
		}
	});

	// click touchend
	$('#submit-btn').on('click', function() {
		for (var contentID in contentViewerMap) {
			var currContent = contentMap[contentID];
			for (let i = 0; i < contentViewerMap[contentID].length; i++) {
				var currViewer = viewerMap[contentViewerMap[contentID][i]];
				if (updateViewerContent(currContent, currViewer)) {
					currViewer.content.push(createContentSmall(currContent));
				}
			}
		}

		var obj = {};
		obj.viewers = viewers;
		$.ajax({
	    url: '/api/viewer/content',
	    type: 'PUT',
	    data: obj,
	    success: function(res) {
				document.location.href = '/signup-success';
  		},
	    error: function(err) {
	      console.log(err);
	    }
		});
	});
});

function validateTarget(e) {

}

function initDataAndDom() {
	// styles
	$.get('/api/content/all')
		.done(function(res) {
			contents = res.contents;
			contentMap = buildMap(contents);
			getContentResults(contents);
			
			$('.tile').hide();
			$('.tile-content').css('margin-top', '55px');
			
			recommended = res.recs;
			showRecommendedResults(recommended);
		})
		.fail(function(error) {
			console.log(error);
		});

	$.get('/api/viewers')
		.done(function(res) {
			viewers = res;
			viewerMap = buildMap(viewers);
			$('#content-results').prepend(getTooltip(viewers));
			$('#tooltip').hide();
		})
		.fail(function(error) {
			console.log(error);
		});
}

function updateViewerContent(currContent, currViewer) {
	for (let i = 0; i < currViewer.content.length; i++) {
		if (currViewer.content[i]._id === currContent._id) {
			return false;
		}
	}
	return true;
}

function createContentSmall(content) {
	var obj = {};
	obj._id = content._id;
	obj.title = content.title;
	return obj;
}

function saveContentViewers(contentID, viewerIDs) {
	if (viewerIDs.length === 0) {
		contentViewerMap[contentID] = [];
		$('#'+contentID).find('p')[0].innerHTML = '';
		$('#'+contentID).css('background-color', '#2C2F3D');
	} else {
		contentViewerMap[contentID] = viewerIDs;
		$('#'+contentID).find('p')[0].innerHTML = viewerIDs.length + ' watching';
		$('#'+contentID).css('background-color', '#727DF0');
	}
}

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
	var start = '<div class="checkbox"><label class="light-gray">';
	var middle = '<input type="checkbox" id="' + viewer._id + '" value="' + viewer.name + '">' + viewer.name;
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
				'<p></p>' +
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

function populateCheckboxes() {
	clearCheckboxes();
	var viewers = contentViewerMap[currTile];
	if (viewers && viewers.length > 0) {
		for (let i = 0; i < viewers.length; i++) {
			$('#'+viewers[i])[0].checked = true;
		}
	}
}

function clearCheckboxes() {
	var checkboxes = $('input:checkbox');
	for (let i = 0; i < checkboxes.length; i++) {
		checkboxes[i].checked = false;
	}
}

function getCheckboxes() {
	var checkboxes = $('input:checkbox');
	var ids = [];
	for (let i = 0; i < checkboxes.length; i++) {
		if (checkboxes[i].checked) {
			ids.push(checkboxes[i].id);
		}
	}
	return ids;
}
