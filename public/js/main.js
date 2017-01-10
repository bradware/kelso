'use strict';

// Wait until DOM loads
$(document).ready(function() {
  // Injecting templates into page and starting event handler
  $('#search-component').load('templates/search.html', handleSearchEvents);
  $('footer').load('templates/footer.html');
});

function handleSearchEvents() {
  // Hide initial components from DOM
  $('.search-extra').hide();
  
  /**
  * When more options is selected, we will hide the link and show the component
  */
  $('#more-options').click(function() {
    $('.search-extra').show();
    $('#more-options').hide();
  });

  // Constants
  var BASE_URL = '/search?';
  var SORT_BY_MAP = {'Distance': 1, 'Ratings': 2};
  
  // Variables stored from DOM
  var searchButton = $('#search-button');
  var locationInput = $('#location');
  var currentLocation = $('#current-location');
  var termInput = $('#term');
  var radiusInput = $('#radius-filter');
  var info = $('#info');
  var tooltip = $('#tooltip').hide();
  var feelingLucky = $('#feeling-lucky');
  var feelingLuckyComponent = $('#feeling-lucky-component').hide();
  var bottom = $('#bottom');
  var resultsComponent = $('#results-component').hide();
  var noResultsComponent = $('#no-results-component').css('background-color', 'white').hide();
  var sortByInput; // element does not exist on DOM yet

  /**
  * Determines if the user is allowed to search
  * If a location is specified, we allow the user to search
  * Location can be specified through input form or 'Use current location' checkbox
  */
  locationInput.on('keyup', function() {
    if (!currentLocation.prop('checked')) {
      var n = this.value.length;
      searchButton.prop('disabled', n < 1 ? true : false);
    }
  });

  /**
  * Hides "I'm feeling lucky" componet from DOM if not checked
  */
  feelingLucky.click(function() {
    if (!this.checked) {
      feelingLuckyComponent.hide();
      $('#feeling-lucky-option').prop('disabled', false);
    } else {
      $('#feeling-lucky-option').prop('disabled', true);
    }
  });

  /**
  * Shows tooltip when user hovers over info icon
  */
  info.mouseenter(function() {
    tooltip.show();
  });
  info.mouseout(function() {
    tooltip.hide();
  });

  /**
  * Disables search ability if a location is not specified
  */
  currentLocation.click(function() {
    if (this.checked) {
      locationInput.prop('disabled', true);
      searchButton.prop('disabled', false);
    } else {
      locationInput.prop('disabled', false);
      if (locationInput.val().length === 0) {
        searchButton.prop('disabled', true);
      } else {
        searchButton.prop('disabled', false);
      }
    }
  });

  /**
  * Event handler that is triggered when user clicks search button
  */
  searchButton.click(function() {
    initSearch();
  });

  /**
  * Event handler that is triggered when the user presses enter
  */
  $(document).keypress(function(e) {
    e = e || window.event;
    if (e.keyCode === 13 && !searchButton.prop('disabled')) {
      initSearch();
    }
  });

  /**
  * Event handler that retriggers search when user changes sort by option
  */
  bottom.change(sortByInput, function() {
    if (sortByInput === null || sortByInput === undefined) {
      sortByInput = $('#sort-by'); // bind variable to DOM element
    }
    initSearch();
  });

  /**
  * Initializes a new search request
  * Makes a GET request to back end which triggers a search request to the Yelp API
  * Clears the old search results before adding the new ones to the DOM
  */
  function initSearch() {
    clearResults();
    getUrl(function(url) {
      requestUrl(url);
    });
  }

  /**
  * Checks each search input in order add params to the request
  */
  function getUrl(callback) {
    var searchUrl = getLocationText(function(locationText) {
      var url = BASE_URL + locationText;
      if (termInput.val().length > 0) {
        var termStr = '&term=' + termInput.val();
        url += termStr;
      }
      if (radiusInput.val().length > 0 && checkRadiusInput(radiusInput.val())) {
        var radiusStr = '&radius_filter=' + convertToMeters(radiusInput.val())
        url += radiusStr;
      }
      if (sortByInput && SORT_BY_MAP.hasOwnProperty(sortByInput.val())) {
        var sortByStr = '&sort=' + SORT_BY_MAP[sortByInput.val()];
        url += sortByStr;
      }
      url += getLimitText();
      url += getActionLinks();
      callback(url);
    });
    callback(searchUrl);
  }

  /**
  * Generates the url location text
  * If the user checked 'Use current location' option, HTML5 geolocation gets the lat and long coordinates
    * Lat and Long coordinates are passed to the back end GET request
  * If the user entered the location through the input, that text is passed to the back end GET request
  */
  function getLocationText(callback) { 
    if (currentLocation.prop('checked')) {
      navigator.geolocation.getCurrentPosition(
        function(pos) {
          callback('&ll='+ pos.coords.latitude + ',' + pos.coords.longitude);
        }, 
        function(error) {
          console.log(error);
          alert('Unable to retrieve your location!');
        },
        { timeout: 10 * 1000 }
      );
    } else {
      callback('location=' + locationInput.val());
    }
  }

  /**
  * Generates the url limit text
  * If the user checked "I'm feeling lucky" option, only 1 result will be returned to the user
    * The GET request will limit the results to just one
  * Defaults to returning 10 results with each user search
  */
  function getLimitText() {
    var limitUrl = '&limit=';
    if (isFeelingLucky()) {
      feelingLuckyComponent.show();
      limitUrl += '1';
    } else {
      limitUrl += '10';
    }
    return limitUrl;
  }

  /**
  * Generates the url for action links if available with the query
  */
  function getActionLinks() {
    return '&actionlinks=true';
  }

  /**
  * Sends a GET request sent to the back end
  * Back end request queries Yelp API
  * Passes data received from back end to handler
  */
  function requestUrl(url) {
    $.get(url, function(data) {
      if (data.hasOwnProperty('businesses')) {
        handleResults(data.businesses);
      }
    })
    .fail(function(error) {
      genNoResults();
    });
  }

  /**
  * Clears and cleans up all the old search results UI components
  * Adds load component to DOM
  */
  function clearResults() {
    feelingLuckyComponent.hide();
    resultsComponent.hide();
    noResultsComponent.hide();
    resultsComponent.empty();
    addLoadingComponent();
  }

  /**
  * Adds/Hides components to DOM when 0 search results are returned
  * Adds No Results component to DOM
  */
  function genNoResults() {
    removeLoadingComponent();
    removeSortedBy();
    feelingLuckyComponent.hide();
    resultsComponent.hide()
    noResultsComponent.show();
  }

  /**
  * Adds/Hides components to DOM when at least 1 search result is returned
  * Adds Results component to DOM
  */
  function genResults(results) {
    removeLoadingComponent();
    bottom.css('background-color', '#FAFAFA');
    genSortedBy();
    genResultsComponent(results);
    noResultsComponent.hide();
    resultsComponent.show();
  }

  /**
  * Event handler when GET results are returned from back end
  * Removes loading component and generates the results components
  * If no results are found, returns 'no-results' component 
  */
  function handleResults(results) {
    if (results.length > 0) {
      genResults(results);
    } else {
      genNoResults();      
    }
  }

  /**
  * Adds the loading component to the DOM if it doesn't already exist
  */
  function addLoadingComponent() {
    bottom.css('background-color', 'white');
    if (!document.getElementById('loading-component')) {
      bottom.append('<div id="loading-component"></div>');
    }
  }

  /**
  * Removes the loading component from the DOM
  */
  function removeLoadingComponent() {
    $('#loading-component').remove();
  }

  /**
  * Generates content for 'Sorted By' component
  */
  function genSortedBy() {
    if (!document.getElementById('sort-by')) {
      var start = '<div id="sorted-by-component">';
      var end = '</div>';
      var content = 
        '<span class="sort-by-label">Sort by: </span>' +
        '<select class="form-control" id="sort-by">' +
          '<option>Best for you</option>' +
          '<option>Distance</option>' +
          '<option>Ratings</option>' +
          '<option id="feeling-lucky-option">Feeling lucky?</option>' +
        '</select>';
      bottom.prepend(start + content + end);
    }
    if (feelingLucky.prop('checked')) {
      $('#feeling-lucky-option').prop('disabled', true);
    } else {
      $('#feeling-lucky-option').prop('disabled', false);
    }
  }

  /**
  * Removes 'Sorted-By' component from DOM
  */
  function removeSortedBy() {
    $('#sorted-by-component').remove();
  }

  /**
  * Adds 'Sorted By' component to top of results
  * Appends all the individual result components to DOM
  */
  function genResultsComponent(results) {
    if (isFeelingLucky() || results.length === 1) {
      resultsComponent.append(genResult(results[0], true));
    } else {
      var row = '<div class="row result-component-container">';
      var end = '</div>';
      for (var i = 0; i < results.length - 1; i += 2) {
        var container = row + genResult(results[i], false) + genResult(results[i+1], false) + end;
        resultsComponent.append(container);
      }
    }
  }

  /**
  * Instantiates a Result object and produces it's card component for UI
  */
  function genResult(result, soloResult) {
    if (result === null || result === undefined) {
      return;
    }

    var newResult = 
      new Result(
        result.name, 
        result.url, 
        result.categories, 
        result.reservation_url,
        result.eat24_url, 
        result.display_phone, 
        result.location.display_address, 
        result.image_url, 
        result.rating_img_url_large,
        soloResult
      );
    return newResult.genCard();
  }

  /**
  * Checks if "I'm feeling lucky" feature is activated
  */
  function isFeelingLucky() {
    if (feelingLucky.prop('checked') || (sortByInput && sortByInput.val() === "Feeling lucky?")) {
      return true;
    } else {
      return false;
    }
  }
}
