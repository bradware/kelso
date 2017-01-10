'use strict';

/**
* Class that encapsulates the data returned from a GET request
* Information is retrieved from back end and then from Yelp API
*/
function Result(name, url, categories, reservationUrl, eat24Url, phone, address, imageUrl, ratingUrl, soloResult) {
  this._name = name;
  this._url = url;
  this._categories = categories;
  this._reservationUrl = reservationUrl;
  this._eat24Url = eat24Url;
  this._phone = phone;
  this._address = address;
  this._imageUrl = imageUrl;
  this._ratingUrl = ratingUrl;
  if (soloResult) {
    this._container = '<div class="result-component-lucky">';
  } else {
    this._container = '<div class="result-component col-xs-12 col-sm-6">';
  }
  this._end = '</div>';
}

/**
* Generates the UI component returned to the DOM from the Result class
* Only public method in Result class
*/
Result.prototype.genCard = function() {
  var cardTop = this._container + this._genResultName() + this._genResultCategoryAndActionLink();
  var cardMain = this._genResultImage() + this._genResultRatingImage();
  var cardBottom = this._genResultPhone() + this._genLocationContainer() + this._end;
  return cardTop + cardMain + cardBottom;
}

/**
* Generates the name and link for the result component card
*/
Result.prototype._genResultName = function() {
  var urlElement = '#';
  if (this._url !== null && this._url !== undefined) {
    urlElement = this._url;
  }
  if (this._name !== null && this._name !== undefined) {
    return '<a href=' + urlElement + ' target="_blank"><h2>' + this._name + '</h2></a>';
  } else {
    return '';
  }
}

/**
* Generates the container for the result's 'Category' and Action link
*/
Result.prototype._genResultCategoryAndActionLink = function() {
  var start = '<h4><b>';
  var end = '</b></h4>';
  var space = ' ';
  var categoryMarkup = this._genCategory();
  var actionLinkMarkup = this._genActionLink();
  return start + categoryMarkup + space + actionLinkMarkup + end;
}

/**
* Generates the content for the 'Category' of the result
*/
Result.prototype._genCategory = function() {
  if (this._categories !== null && this._categories !== undefined && this._categories.length !== 0) {
    if (this._categories[0].length !== 0) {
      return '<span>' + this._categories[0][0] + '</span>';
    }
  }
  return '';
}

/**
* Generates the content for if the result's 'Action' link
*/
Result.prototype._genActionLink = function() {
  if (this._reservationUrl !== null && this._reservationUrl !== undefined) {
    return '<a class="action-link" href=' + this._reservationUrl + ' target="_blank">Find Table'  + '</a>';
  } else if (this._eat24Url !== null && this._eat24Url !== undefined) {
    return '<a class="action-link" href=' + this._eat24Url + ' target="_blank">Order Now'  + '</a>';
  } else {
    return '';
  }
}

/**
* Generates the main image for the result component
* Defaults to IMAGE NOT AVAILABLE
*/
Result.prototype._genResultImage = function() {
  if (this._imageUrl === undefined || this._imageUrl === null) {
    this._imageUrl = '../images/image_not_available.png';
  }
  return '<img class="result-image" src=' + this._imageUrl + '>' + '<br>'; 
}

/**
* Generates the rating (stars) image for the result component
* Defaults to not generating anything
*/
Result.prototype._genResultRatingImage = function() {
  if (this._ratingUrl === undefined || this._ratingUrl === null) {
    return '';
  } else {
    return '<img src=' + this._ratingUrl + '>'; 
  }
}

/**
* Generates the phone number content for the result component
*/
Result.prototype._genResultPhone = function() {
  if (this._phone !== null && this._phone !== undefined) {
    return '<a href="tel:"' + this._phone + '><h3>' + this._phone + '</h3></a>';
  } else {
    return '<h3></h3>';
  }
}

/**
* Generates the location/address container for the result component
*/
Result.prototype._genLocationContainer = function() {
  if (this._address !== null && this._address !== undefined) {
    var displayAddress = this._address[0] + this._address[1];
    var container = '<div class="location-container">';
    var containerEnd = '</div>';
    var link = '<a href="http://maps.google.com/?q=' + displayAddress + '"target="_blank">';
    var linkEnd = '</a>';
    var address0 = this._genResultLocation(this._address[0]);
    var address1 = this._genResultLocation(this._address[1]);
    var address2 = this._genResultLocation(this._address[2]);
    return container + link + address0 + address1 + address2 + linkEnd + containerEnd;
  } else {
    return '';
  }
}

/**
* Generates the location/address content for the location container
*/
Result.prototype._genResultLocation = function(address) {
  if (address !== null && address !== undefined) {
    return '<h3>' + address + '</h3>';
  } else {
    return '';
  }
}
