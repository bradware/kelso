'use strict';

// Wait until DOM loads
$(document).ready(function() {
  var submitBtn = $('#submit-btn');
	var tile = $('.tile');
  var titles = new Set();

  tile.click(function(e) {
    var contentTitle = e.currentTarget.children[0].children[0].innerHTML;

    if (titles.has(contentTitle)) {
      titles.delete(contentTitle);
    } else {
      titles.add(contentTitle);
    }
  });

  submitBtn.click(function() {
    var obj = {};
    obj.contentTitles = [ ];
    for (let title of titles) {
      obj.contentTitles.push(title);
    }

    $.post('/api/viewer/content', obj)
      .done(function(res) {
        console.log(res);
        if (res.redirect) {
          document.location.href = res.redirect;
        }
      })
      .fail(function(error) {
        console.log(error);
      });
  });

});
