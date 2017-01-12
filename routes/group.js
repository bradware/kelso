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
		var loggedInUser = {};
		loggedInUser._id = req.session.viewerID;
		loggedInUser.name = req.session.viewerName;
  	group.viewers.push(loggedInUser);
		for (let i = 0; i < viewers.length; i++) {
			var obj = {};
			obj._id = viewers[i]._id;
			obj.name = viewers[i].name;
    	group.viewers.push(obj);
    }

    Content.findOne({'title': req.body.contentTitle}, function(err, content) {
    	if (err) {
    		next(err);
    	} else {
    		var contentObj = {};
    		contentObj._id = content._id;
    		contentObj.title = content.title;
    		group.content = contentObj;
    		group.name = req.session.viewerName + '|' + content.title;
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

router.get('/groups', middleware.isLoggedIn, function(req, res, next) {
	Group.find({'viewers._id': req.session.viewerID}, function(err, groups) {
		if (err) {
			next(err);
		} else {
			res.json({
				groups
			});
		}
	});
});

module.exports = router;