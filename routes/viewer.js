'use strict';

require('rootpath')();

var express = require('express');
var router = express.Router();
var middleware = require('middleware');
var Viewer = require('models/viewer');
var Content = require('models/content');

router.get('/viewer', middleware.isLoggedIn, function(req, res, next) {
  Viewer.findById(req.session.viewerID, function (err, viewer) {
    if (err) {
      next(err);
    } else {
      res.status(200);
      res.send(viewer);
    }
  });
});

router.post('/viewer', middleware.isLoggedIn, function(req, res, next) {
  Viewer.findById(req.session.viewerID, function (err, viewer) {
    if (err) {
      next(err);
    } else {
      if (req.body.viewers && req.body.viewers.length > 0) {
        var viewerSmall = createViewerSmall(viewer);
        req.body.viewers.forEach(function(obj) {
          otherViewerExists(obj, viewerSmall, function(err, otherViewer) {
            if (err) {
              next(err);
            } else if (!otherViewer) {
              otherViewer = createNewViewer(obj, viewerSmall);
            }
            var otherViewerSmall = createViewerSmall(otherViewer);
            if (updateOtherViewersArray(viewer, otherViewerSmall)) {
              Viewer.findByIdAndUpdate(viewer._id, {$push:{other_viewers: otherViewerSmall}}, {new: true}, function(err) {
                if (err) {
                  return next(err);
                }
              });
            }
          });
        });
      }
    }
    res.status(200);
    res.send({redirect: '/signup-content'});
  });
});

router.put('/viewer/other-viewers', middleware.isLoggedIn, function(req, res, next) {
  Viewer.findById(req.session.viewerID, function (err, viewer) {
    if (err) {
      next(err);
    } else {
      if (!req.body.otherViewers) {
        req.body.otherViewers = [];
      }
      Viewer.findByIdAndUpdate(viewer._id, {other_viewers: []}, {new: true}, function(err, viewer) {
        if (err) {
          return next(err);
        } else {
          var viewerSmall = createViewerSmall(viewer);
          req.body.otherViewers.forEach(function(obj) {
            otherViewerExists(obj, viewerSmall, function(err, otherViewer) {
              if (err) {
                next(err);
              } else if (!otherViewer) {
                otherViewer = createNewViewer(obj, viewerSmall);
              }
              var otherViewerSmall = createViewerSmall(otherViewer);
              Viewer.findByIdAndUpdate(viewer._id, {$push:{other_viewers: otherViewerSmall}}, {new: true}, function(err) {
                if (err) {
                  return next(err);
                }
              });
            });
          });
        }
      });
    }
    res.status(200);
    res.send({redirect: '/home'});
  });
});

router.post('/viewer/content', middleware.isLoggedIn, function(req, res, next) {
  for (let i = 0; i < req.body.viewers.length; i++) {
    Viewer.findByIdAndUpdate(req.body.viewers[i]._id, req.body.viewers[i], {new: true}, function(err, viewer) {
      if (err) {
        next(err);
      }
    }); 
  }
  res.status(200);
  res.send({redirect: '/signup-success'});
});

router.put('/viewer/content', middleware.isLoggedIn, function(req, res, next) {
  Viewer.findById(req.session.viewerID, function(err, viewer) {
    if (err) {
      next(err);
    } else {
      viewer.content = req.body.content;
      viewer.save(function(err) {
        if (err) {
          console.log(err);
        } else {
          res.status(200);
          res.send({redirect: '/home'});
        }
      });
    }
  }); 
});

router.get('/viewers', middleware.isLoggedIn, function(req, res, next) {
  Viewer.findById(req.session.viewerID, function(err, viewer) {
    if (err) {
      next(err);
    } else {
      Viewer.find({'_id': {$in: viewer.other_viewers}}, function(err, otherViewers) {
        if (otherViewers) {
          otherViewers.unshift(viewer);
          res.send(otherViewers);
        } else {
          otherViewers = [];
          otherViewers.push(viewer);
          res.send(otherViewers);
        }
      });
    }
  });
});

/*
* Helper functions below for route logic
*/

function updateOtherViewersArray(viewer, viewerSmall) {
  var found = false;
  for (var i = 0; i < viewer.other_viewers.length; i++) {
    if (viewer.other_viewers[i].email === viewerSmall.email) {
        found = true;
        break;
    }
  }
  return !found;
}

function otherViewerExists(obj, viewerSmall, callback) {
  Viewer.findOne({'email': obj.email}, function(err, viewer) {
    if (err) {
      console.log(err);
      callback(err, null);
    } else {
      if (viewer) {
        if (updateOtherViewersArray(viewer, viewerSmall)) {
          Viewer.findByIdAndUpdate(viewer._id, {$push:{other_viewers: viewerSmall}}, {new: true}, function(err) {
            if (err) {
              return next(err);
            }
          });
        }
        viewer.save(function(err) {
          if (err) {
            console.log(err);
          }
        });
        callback(null, viewer);
      } else {
        callback(null);
      }
    }
  });
}

function createViewerSmall(viewer) {
  var otherViewer = {};
  otherViewer._id = viewer._id;
  otherViewer.name = viewer.name;
  otherViewer.email = viewer.email;
  return otherViewer;
}

function createNewViewer(obj, viewerSmall) {
  var newViewer = new Viewer();
  newViewer.name = obj.name;
  newViewer.email = obj.email;
  newViewer.other_viewers.push(viewerSmall);
  newViewer.save(function(err) {
    if (err) {
      console.log(err);
    }
  });
  return newViewer;
}

function updateContentArray(content, title) {
  var found = false;
  for (var i = 0; i < content.length; i++) {
    if (content[i].title === title) {
        found = true;
        break;
    }
  }
  return !found;
}

module.exports = router;
