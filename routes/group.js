'use strict';

require('rootpath')();

var express = require('express');
var router = express.Router();
var middleware = require('middleware');
var Viewer = require('models/Viewer');
var Group = require('models/Viewer');

router.get('/group', middleware.isLoggedIn, function(req, res, next) {
	Group.findById(req.session.groupID, function (err, group) {
		if (err) {
			next(err);
		} else {
			res.status(200);
			res.json({
				group
			});
		}
	});
});

router.put('/group', middleware.isLoggedIn, function(req, res, next) {
	Group.findById(req.session.groupID, function (err, group) {
		if (err) {
			next(err);
		} else {
			group.update(req.body, function (err, group) {
    		if (err) {
					next(err);
				} else {
					res.status(200);
					res.json({
						group
					});
				}
  		});
		}
	});
});

router.delete('/group', middleware.isLoggedIn, function(req, res, next) {
	Group.remove({_id: req.session.groupID}, function (err) {
		if (err) {
			next(err);
		} else {
			res.status(200);
			res.json({
				success: {
					message: 'Group deleted'
				}
			});
		}
	});
});

module.exports = router;