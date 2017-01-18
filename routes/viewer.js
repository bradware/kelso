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
				console.log(otherViewers);
				otherViewers.forEach(function(obj) {
					var newViewer = new Viewer();
					newViewer.name = obj.name;
					newViewer.email = obj.email;
					newViewer.password = 123;
					var viewerObj = {};
					viewerObj._id = req.session.viewerID;
					viewerObj.name = req.session.viewerName;
					viewerObj.email = req.session.viewerEmail;
					newViewer.other_viewers.push(viewerObj);
					newViewer.save(function(err, newViewer) {
						if (err) {
							return next(err);
						} else {
							var newViewerObj = {};
							newViewerObj._id = newViewer._id;
							newViewerObj.name = newViewer.name;
							newViewerObj.email = newViewer.email;
							console.log('pushing another viewer');
							console.log(newViewerObj);
							viewer.other_viewers.push(newViewerObj);
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
	Content.findOne({'title': {$in: req.body.contentTitle}}, function(err, content) {
		if (err) {
			next(err);
		} else {
			var contentObj = {};
			contentObj._id = content._id;
			contentObj.title = content.title;
			
			for (let i = 0; i < req.body.ids.length; i++) {
				Viewer.findById(req.body.ids[i], function (err, viewer) {
					if (err) {
						next(err);
					} else {
						viewer.content.push(contentObj);
						viewer.save(function (err, viewer) {
			    		if (err) {
								next(err);
							}
			  		});
					}
				});
			}
		}
	});
});

router.get('/viewers', middleware.isLoggedIn, function(req, res, next) {
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
