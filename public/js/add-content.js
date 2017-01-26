'use strict';

// lists
var contents = null;
var recommended = null;

// helper maps
var contentMap = null; // built after API call
var watchMap = null; // built after API call

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
    var contentID = $(e.target).closest('.tile')[0].id;
    if (watchMap[contentID]) {
      $('#'+contentID).css('background-color', '#2C2F3D');
      delete watchMap[contentID];
    } else {
      $('#'+contentID).css('background-color', '#727DF0');
      watchMap[contentID] = contentMap[contentID];
    }
  });

  // click touchend
  $('#submit-btn').on('click', function() {
    var contentArr = [];
    for (var contentID in watchMap) {
      contentArr.push(createContentSmall(watchMap[contentID]));
    }

    var obj = {};
    obj.content = contentArr;
    $.ajax({
      url: '/api/viewer/content',
      type: 'PUT',
      data: obj,
      success: function(res) {
        document.location.href = res.redirect;
      },
      error: function(err) {
        console.log(err);
      }
    });
  });
});

function initDataAndDom() {
  $.get('/api/viewer')
    .done(function(res) {
      watchMap = buildMap(res.content);
    })
    .fail(function(error) {
      console.log(error);
    });

  $.get('/api/content/all')
    .done(function(res) {
      contents = res.contents;
      contentMap = buildMap(contents);
      getContentResults(contents);
      $('#content-results').css('background-color', '#1D1F29');
      $('.tile').hide();
      $('.tile-content').css('margin-top', '55px');
      
      recommended = res.recs;
      showRecommendedResults(recommended);
    })
    .fail(function(error) {
      console.log(error);
    });
}

function createContentSmall(content) {
  var obj = {};
  obj._id = content._id;
  obj.title = content.title;
  return obj;
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
    if (watchMap[arr[i]._id]) {
      $('#'+arr[i]._id).css('background-color', '#727DF0');
    }
  }
}

function renderContentResult(res) {
  var content =
    '<div class="col-xs-6 text-center tile medium-gray" id="' + res._id + '">' +
      '<div class="tile-content">' +
        '<h4>' + res.title +'</h4>' +
        '<p class="light-font"></p>' +
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
