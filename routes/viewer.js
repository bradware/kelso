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
			if (req.body.viewers) {
				var viewerSmall = createViewerSmall(viewer);
				req.body.viewers.forEach(function(obj) {
					var otherViewer = otherViewerExists(obj, viewerSmall);
					if (!otherViewer) {
						otherViewer = createNewViewer(obj, viewerSmall);
					}
					viewer.other_viewers.push(createViewerSmall(otherViewer));
				});
				viewer.save(function(err) {
					if (err) {
						console.log(err);
						next(err);
					}
				});
			}
			res.send({redirect: '/signup-content'});
		}
	});
});

function otherViewerExists(obj, viewerSmall) {
	var otherViewer = null;
	Viewer.findOne({'email': obj.email}, function(err, viewer) {
		if (err) {
			next(err);
		} else {
			if (viewer) {
				viewer.other_viewers.push(viewerSmall);
				otherViewer = viewer;
				viewer.save(function(err) {
					if (err) {
						console.log(err);
					}
				});
			}
		}
	});
	return otherViewer;
}

function createViewerSmall(viewer) {
	var otherViewer = {};
	otherViewer._id = viewer._id;
	otherViewer.name = viewer.name;
	otherViewer.email = viewer.email;
	return otherViewer;
}

function createNewViewer(obj, viewer) {
	var newViewer = new Viewer();
	newViewer.name = obj.name;
	newViewer.email = obj.email;
	newViewer.other_viewers.push(viewer);
	newViewer.save(function(err) {
		if (err) {
			console.log(err);
		}
	});
	return newViewer;
}

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
