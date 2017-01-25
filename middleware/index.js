'use strict';

function isLoggedIn(req, res, next) {
  if (req.session && req.session.viewerID) {
    return next();
  } else {
    var err = new Error('Viewer not logged in');
    err.status = 401;
    return next(err);
  }
}

function isLoggedOut(req, res, next) {
  if (req.session && req.session.viewerID) {
    var err = new Error('Viewer already logged in');
    err.status = 401;
    return next(err);
  } else {
    return next();
  }
}

module.exports.isLoggedIn = isLoggedIn;
module.exports.isLoggedOut = isLoggedOut;
