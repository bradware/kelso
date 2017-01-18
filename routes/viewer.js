'use strict';

require('rootpath')();

var express = require('express');
var router = express.Router();
var middleware = require('middleware');
var Viewer = require('models/viewer');
var Content = require('models/Content');

router.get('/viewer', middleware.isLoggedIn, function(req, res, next) {
	Viewer.findById(req.session.viewerID, function (err, viewer) {
		if (err) {
			next(err);
		} else {
			res.status(200);
			res.json({
				viewer
			});
		}
	});
});

router.post('/viewer', middleware.isLoggedIn, function(req, res, next) {
	Viewer.findById(req.session.viewerID, function (err, viewer) {
		if (err) {
			next(err);
		} else {
			var otherViewers = req.body.viewers;
			if (otherViewers) {
				otherViewers.forEach(function(obj) {
					var newViewer = new Viewer();
					newViewer.name = obj.name;
					newViewer.email = obj.email;
					newViewer.password = 123;
					newViewer.other_viewers.push(req.session.viewerID);
					newViewer.save(function(err, newViewer) {
						if (err) {
							return next(err);
						} else {
							viewer.other_viewers.push(newViewer._id);
							viewer.save(function(err, viewer) {
								if (err) {
									return next(err);
								}
							});
						}
					});
				});
			}
			res.send({redirect: '/signup-content'});
		}
	});
});

router.post('/viewer/content', middleware.isLoggedIn, function(req, res, next) {
	var contentTitles = req.body.contentTitles;
	Viewer.findById(req.session.viewerID, function (err, viewer) {
		if (err) {
			next(err);
		} else {
			Content.find({'title': { $in: req.body.contentTitles}}, function(err, contents) {
		    var arr = [];
		    for (let i = 0; i < contents.length; i++) {
		    	arr.push(contents[i]._id);
		    }
				viewer.update({content: arr}, function (err, viewer) {
	    		if (err) {
						next(err);
					} else {
						res.send({redirect: '/home'});
					}
	  		});
			});
		}
	});
});

router.get('/viewer/content', middleware.isLoggedIn, function(req, res, next) {
	var contentTitles = req.body.contentTitles;
	Viewer.findById(req.session.viewerID, function(err, viewer) {
		if (err) {
			next(err);
		} else {
			Viewer.find({'_id': {$in: viewer.other_viewers}}, function(err, otherViewers) {
				otherViewers.unshift(viewer);
		    res.send(otherViewers);
			});
		}
	});
});

module.exports = router;
