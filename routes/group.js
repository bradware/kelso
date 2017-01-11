'use strict';

require('rootpath')();

var express = require('express');
var router = express.Router();
var middleware = require('middleware');
var Viewer = require('models/viewer');
var Group = require('models/group');
var Content = require('models/content');

router.post('/group', middleware.isLoggedIn, function(req, res, next) {
	Viewer.find({'name': { $in: req.body.names}}, function(err, viewers) {
		var group = new Group();
		group.viewers.push(req.session.viewerID); // add viewer logged in to group
		for (let i = 0; i < viewers.length; i++) {
    	group.viewers.push(viewers[i]._id);
    }

    Content.findOne({'title': req.body.contentTitle}, function(err, content) {
    	if (err) {
    		next(err);
    	} else {
    		group.content = content._id;
    		group.name = 'Group: ' + req.session.name + '|' + content.title;
    		group.save(function(err, newGroup) {
					if (err) {
						return next(err);
					} else {
						res.json({msg: 'New Group was saved!'});
					}
				});
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