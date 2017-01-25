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

router.get('/content/all', function(req, res, next) {
	Content.find({}, function(err, contents) {
		if (err) {
			next(err);
		} else {
			var recommended = ['Game of Thrones', 'The Office', 'Star Wars', 'La La Land'];
			Content.find({'title': {$in: recommended}}, function(err, recs) {
				if (err) {
					next(err);
				} else {
					res.send({contents: contents, recs: recs});
				}
		  });
		}
  });
});

router.get('/content/rec', function(req, res, next) {
	var recommended = ['Game of Thrones', 'The Office', 'Star Wars', 'La La Land'];
	Content.find({'title': {$in: recommended}}, function(err, contents) {
		if (err) {
			next(err);
		} else {
			res.send(contents);
		}
  });
});

module.exports = router;
