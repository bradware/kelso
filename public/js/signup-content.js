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
  
  $(document).on('click', '.tile', function(e) {
    var $this = $(e.target).closest('.tile')[0];
    if (!currTile) {
      currTile = $this.id;
    }
    saveContentViewers(currTile, getCheckboxes());
    currTile = $this.id;

    var centerX = ($($this).offset().left + $($this).width() / 2) - (($('#tooltip').width() / 2) - 5);
    var centerY = ($($this).offset().top + $($this).height() / 2) - (($('#tooltip').height() / 2) + 10);
    
    $('#tooltip').fadeIn().css(({left: centerX, top: centerY}));
    $('#'+currTile).fadeIn().css('background-color', '#727DF0');
    populateCheckboxes();
    updateSubmitBtn();
  });

  $(document).on('click', 'html', function(e) {
    if ($(e.target).hasClass('tile') || $(e.target).parents('.tile').length > 0 || 
        $(e.target).parents('#tooltip').length > 0) {
      return;
    } else {
      if (currTile) {
        $('#tooltip').fadeOut();
        saveContentViewers(currTile, getCheckboxes());
      }
    }
    updateSubmitBtn();
  });

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
    $.post('/api/viewer/content', obj)
      .done(function(res) {
        if (res.redirect) {
          document.location.href = res.redirect;
        }
      })
      .fail(function(error) {
        console.log(error);
      });
  });
});

function updateSubmitBtn() {
  if (emptyMap()) {
    if (!$('#submit-btn').hasClass('purple')) {
      $('#submit-btn').addClass('purple');
      $('#submit-btn').removeClass('green');
      $('#submit-btn').html('skip');
    }
  } else {
    if (!$('#submit-btn').hasClass('green')) {
      $('#submit-btn').addClass('green');
      $('#submit-btn').removeClass('purple');
      $('#submit-btn').html('next');
    }
  }
}

function emptyMap() {
  for (var prop in contentViewerMap) {
    if (contentViewerMap.hasOwnProperty(prop)) {
      return false;
    }
  }
  return true;
}

function initDataAndDom() {
  $.get('/api/content/all')
    .done(function(res) {
      contents = res.contents;
      contentMap = buildMap(contents);
      getContentResults(contents);
      $('#content-results').css('background-color', '#1D1F29');
      $('.tile').hide();
      $('.tile-content').css('margin-top', '50px');
      
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
    delete contentViewerMap[contentID];
    $('#'+contentID).find('p')[0].innerHTML = '';
    $('#'+contentID).css('background-color', '#2C2F3D');
  } else {
    contentViewerMap[contentID] = viewerIDs;
    $('#'+contentID).find('p')[0].innerHTML = viewerIDs.length + ' watching';
    $('#'+contentID).css('background-color', '#727DF0');
  }
}

function getTooltip(arr) {
  var start = '<a href="#"><div id="tooltip"><h4 class="text-center">Who?</h4>';
  var middle = '';
  var end = '</div></a>';
  for (let i = 0; i < arr.length; i++) {
    middle += renderTooltipContent(arr[i]);
  }
  return start + middle + end;
}

function renderTooltipContent(viewer) {
  var start = '<div class="checkbox"><label class="light-gray-font">';
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
    '<a href="#">' +
      '<div class="col-xs-6 text-center tile medium-gray" id="' + res._id + '">' +
        '<div class="tile-content">' +
          '<h4>' + res.title +'</h4>' +
          '<p class="light-font"></p>' +
        '</div>' +
      '</div>' +
    '</a>';
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
