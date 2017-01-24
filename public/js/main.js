'use strict';

// Wait until DOM loads
$(document).ready(function() {
  $('header').load('templates/header.html');
});

function goBack() {
  window.history.back();
}