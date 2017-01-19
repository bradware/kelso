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
	Viewer.findOne({'email': req.body.email}, function(err, viewer) {
  	if (err) {
  		next(err);
  	} else {
  		if (!viewer) {
  			var viewer = new Viewer(req.body);
				viewer.save(function(err, newViewer) {
					if (err) {
						return next(err);
					} else {
						req.session.viewerID = newViewer._id;
						req.session.viewerEmail = newViewer.email;
						req.session.viewerName = newViewer.name;
						res.send({redirect: '/signup-viewer'});
					}
				});
  		} else {
  			Viewer.findByIdAndUpdate(viewer._id, req.body, function (err, updatedViewer) {
				  if (err) {
						next(err);
					} else {
						req.session.viewerID = updatedViewer._id;
						req.session.viewerEmail = updatedViewer.email;
						req.session.viewerName = updatedViewer.name;
						res.send({redirect: '/signup-viewer'});
					}
				});
  		}
  	}
  });
});

module.exports = router;
