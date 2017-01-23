'use strict';

require('rootpath')();

var express = require('express');
var router = express.Router();
var middleware = require('middleware');
var path = require('path');

router.get('/', function(req, res, next) {
	res.sendFile(path.join(__dirname, '../public/templates', 'index.html'));
});

router.get('/login', function(req, res, next) {
	if (isLoggedIn(req)) {
		res.redirect('/home');
	} else {
		res.sendFile(path.join(__dirname, '../public/templates', 'login.html'));
	}
});

router.get('/logout', function(req, res, next) {
	if (isLoggedIn(req)) {
		req.session.destroy(function(err) {
	    if (err) {
	    	return next(err);
	  	} else {
	  		res.redirect('/');
	  	}
		});
	} else {
		res.redirect('/login');
	}
});

router.get('/home', function(req, res, next) {
	if (isLoggedIn(req)) {
		res.sendFile(path.join(__dirname, '../public/templates', 'home.html'));
	} else {
		res.redirect('/login');
	}
});

router.get('/signup', function(req, res, next) {
	if (isLoggedIn(req)) {
		res.redirect('/home');
	} else {
		res.sendFile(path.join(__dirname, '../public/templates', 'signup.html'));
	}
});

router.get('/signup-success', function(req, res, next) {
	res.sendFile(path.join(__dirname, '../public/templates', 'signup-success.html'));
});

router.get('/signup-viewer', function(req, res, next) {
	res.sendFile(path.join(__dirname, '../public/templates', 'signup-viewer.html'));
});

router.get('/signup-content', function(req, res, next) {
	res.sendFile(path.join(__dirname, '../public/templates', 'signup-content.html'));
});

router.get('/add-viewer', function(req, res, next) {
	res.sendFile(path.join(__dirname, '../public/templates', 'add-viewer.html'));
});

router.get('/add-content', function(req, res, next) {
	res.sendFile(path.join(__dirname, '../public/templates', 'add-content.html'));
});

router.get('/watch', function(req, res, next) {
	if (isLoggedIn(req)) {
		res.sendFile(path.join(__dirname, '../public/templates', 'watch.html'));
	} else {
		res.redirect('/login');
	}
});

function isLoggedIn(req) {
	if (req.session && req.session.viewerID) {
		return true;
  } else {
  	return false;
  }
}

module.exports = router;
