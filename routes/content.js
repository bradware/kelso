'use strict';

require('rootpath')();

var express = require('express');
var router = express.Router();
var middleware = require('middleware');
var Content = require('models/content');

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