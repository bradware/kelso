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
			res.send({redirect: '/signup-content.html'});
		}
	});
});

router.put('/viewer', middleware.isLoggedIn, function(req, res, next) {
	Viewer.findById(req.session.viewerID, function (err, viewer) {
		if (err) {
			next(err);
		} else {
			viewer.update(req.body, function (err, viewer) {
    		if (err) {
					next(err);
				} else {
					res.status(200);
					res.json({
						viewer
					});
				}
  		});
		}
	});
});

router.delete('/viewer', middleware.isLoggedIn, function(req, res, next) {
	Viewer.remove({_id: req.session.viewerID}, function (err) {
		if (err) {
			next(err);
		} else {
			req.session.destroy(function(err) {
				if (err) {
		    	return next(err);
		  	} else {
					res.status(200);
					res.json({
						success: {
  						message: 'Viewer deleted'
  					}
					});
		  	}
			});
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
						res.send({redirect: '/home.html'});
					}
	  		});
			});
		}
	});
});

router.get('/viewer/content', middleware.isLoggedIn, function(req, res, next) {
	var contentTitles = req.body.contentTitles;
	Viewer.findById(req.session.viewerID, function (err, viewer) {
		if (err) {
			next(err);
		} else {
			Viewer.find({'_id': { $in: viewer.other_viewers}}, function(err, otherViewers) {
		    res.send(otherViewers);
			});
		}
	});
});

module.exports = router;
