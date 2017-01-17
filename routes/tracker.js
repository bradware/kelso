'use strict';

require('rootpath')();

var express = require('express');
var router = express.Router();
var middleware = require('middleware');
var Tracker = require('models/tracker');

router.post('/tracker', middleware.isLoggedIn, function(req, res, next) {
	console.log(req.body);
	var tracker = new Tracker();
	tracker.viewer = req.session.viewerID;
	tracker.group = req.body.group._id;
	tracker.content = req.body.group.content._id;
	tracker.save(function(err, newTracker) {
		if (err) {
			return next(err);
		} else {
			res.send({redirect: '/home'});
		}
	});
});

module.exports = router;