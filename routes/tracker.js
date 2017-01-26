'use strict';

require('rootpath')();

var express = require('express');
var router = express.Router();
var middleware = require('middleware');
var Tracker = require('models/tracker');

router.post('/tracker', middleware.isLoggedIn, function(req, res, next) {
  var tracker = new Tracker(req.body);
  tracker.save(function(err, newTracker) {
    if (err) {
      return next(err);
    } else {
      res.send({redirect: '/watch-success'});
    }
  });
});

module.exports = router;
