'use strict';

require('rootpath')();

var express = require('express');
var router = express.Router();
var middleware = require('middleware');
var Content = require('models/content');

router.use('/register', function(req, res, next) {
	if (req.body.title && req.body.description && req.body.source && req.body.popularity) {
		next();
	} else {
		var err = new Error('All fields are required to register');
		err.status = 400;
		return next(err);
	}
});

router.post('/content', function(req, res, next) {
	var content = new Content(req.body);
	content.save(function(err, newContent) {
		if (err) {
			return next(err);
		} else {
			return res.json({
				newContent
  		});
		}
	});
});

module.exports = router;