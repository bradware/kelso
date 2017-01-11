'use strict';

require('rootpath')();

var express = require('express');
var router = express.Router();
var middleware = require('middleware');
var Viewer = require('models/Viewer');

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
			viewer.update({content: contentTitles}, function (err, viewer) {
    		if (err) {
					next(err);
				} else {
					res.send({redirect: '/signup-group.html'});
				}
  		});
		}
	});
});

module.exports = router;
