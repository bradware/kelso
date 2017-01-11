'use strict';

require('rootpath')();

var express = require('express');
var router = express.Router();
var middleware = require('middleware');
var Viewer = require('models/Viewer');

router.use('/register', function(req, res, next) {
	if (req.body.name && req.body.age && req.body.gender && req.body.email && req.body.password) {
		next();
	} else {
		var err = new Error('All fields are required to register');
		err.status = 400;
		return next(err);
	}
});

router.post('/register', function(req, res, next) {
	var viewer = new Viewer(req.body);
	viewer.save(function(err, newViewer) {
		if (err) {
			return next(err);
		} else {
			req.session.viewerID = newViewer._id;
			req.session.viewerEmail = newViewer.email;
			req.session.name = newViewer.name;
			res.send({redirect: '/signup-group.html'});
		}
	});
});

module.exports = router;
