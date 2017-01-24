'use strict';

// Wait until DOM loads
$(document).ready(function() {
  $('header').load('templates/header.html');
});

function goBack() {
	if (document.referrer.indexOf(window.location.host) !== -1) { 
		history.go(-1); 
	} else { 
		window.location.href = '/'; 
	}
}