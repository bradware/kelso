'use strict';

require('rootpath')();

var express = require('express');
var router = express.Router();
var middleware = require('middleware');
var Viewer = require('models/viewer');
var Content = require('models/Content');

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
			if (viewer && req.body.otherViewers) {
				viewer.other_viewers = req.body.otherViewers;
				viewer.save(function(err) {
					if (err) {
						console.log(err);
					} else {
						res.status(200);
						res.send({redirect: '/home'});
					}
				});
			}
		}
	});
});

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

router.post('/viewer/content', middleware.isLoggedIn, function(req, res, next) {
	Content.findOne({'title': {$in: req.body.contentTitle}}, function(err, content) {
		if (err) {
			next(err);
		} else {
			var contentObj = {};
			contentObj._id = content._id;
			contentObj.title = content.title;
			
			for (let i = 0; i < req.body.ids.length; i++) {
				Viewer.findById(req.body.ids[i], function (err, viewer) {
					if (err) {
						next(err);
					} else {
						if (updateContentArray(viewer.content, contentObj.title)) {
							Viewer.findByIdAndUpdate(viewer._id, {$push:{content: contentObj}}, {new: true}, function(err) {
								if (err) {
									return next(err);
								} else {
									res.status(200);
								}
							});
						}
					}
				});
			}
		}
	});
});

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

router.get('/viewer/content', middleware.isLoggedIn, function(req, res, next) {
	Viewer.findById(req.session.viewerID, function(err, viewer) {
		if (err) {
			next(err);
		} else {
			var obj = {};
			obj.viewer = viewer;

			Viewer.find({'_id': {$in: viewer.other_viewers}}, function(err, otherViewers) {
				if (otherViewers) {
					obj.other_viewers = otherViewers;
		    	res.send(obj);
				} else {
					obj.other_viewers = [];
					res.send(obj);
				}
			});
		}
	});
});

router.delete('/viewer/:otherViewerID', middleware.isLoggedIn, function(req, res, next) {
	Viewer.findById(req.session.viewerID, function(err, viewer) {
		if (err) {
			next(err);
		} else {
			for (let i = 0; i < viewer.other_viewers.length; i++) {
		    if (viewer.other_viewers[i]._id == req.params.otherViewerID) {
	        viewer.other_viewers.splice(i, 1);
	        break;
		    }
			}
			viewer.save(function(err) {
				if (err) {
					next(err);
				}
			});
		}
	});
});

module.exports = router;
