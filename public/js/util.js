'use strict';

/**
* Utility method to convert miles to meters
*/
function convertToMeters(miles) {
  return miles * 1609.34;
}

/**
* Utility method to check the radius input 
* If within the bounds, it will be passed as a param to the GET request to the back end
* Yelp API limits the radius input it can receive
*/
function checkRadiusInput(input) {
  if (isNum(input)) {
    if (input > 0 && input < 36) {
      return true;
    }
  }
  return false;
}

/**
* Utility method to check if the param passed is a number
*/
function isNum(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
