'use strict';

require('rootpath')();

var express = require('express');
var router = express.Router();
var middleware = require('middleware');
var Viewer = require('models/viewer');

router.use('/login', middleware.isLoggedOut, function(req, res, next) {
	if (req.body.email && req.body.password) {
		next();
	} else {
		var err = new Error('Email and password are required');
		err.status = 401;
		return next(err);
	}
});

router.post('/login', function(req, res, next) {
	Viewer.authenticate(req.body.email, req.body.password, function(error, viewer) {
		if (error) {
			next(error);
		} else {
			req.session.viewerID = newViewer._id;
			req.session.viewerEmail = newViewer.email;
			res.status(200);
			res.json({
				viewer: viewer
			});
		}
	});
});

module.exports = router;
