'use strict';

require('rootpath')();

var express = require('express');
var router = express.Router();
var middleware = require('middleware');
var Viewer = require('models/Viewer');
var Group = require('models/Group');

router.post('/group', middleware.isLoggedIn, function(req, res, next) {
	Viewer.find({'email': { $in: req.body.emails}}, function(err, viewers) {
    var set = new Set();
    for (let i = 0; i < viewers.length; i++) {
    	set.add(viewers[i]._id);
    }
    var arr = Array.from(set);
    arr.push(req.session.viewerID);
		var group = new Group();
		group.name = 'Group';
		group.viewers = arr;
		group.save(function(err, newGroup) {
			if (err) {
				return next(err);
			} else {
				res.send({redirect: '/home.html'});
			}
		});
	});
});

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