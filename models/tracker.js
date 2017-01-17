'use strict';

var mongoose = require('mongoose');

var TrackerSchema = mongoose.Schema({
	viewer: {type: mongoose.Schema.Types.ObjectId, ref: 'Viewer', required: true},
	group: {type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true},
	content: {type: mongoose.Schema.Types.ObjectId, ref: 'Content', required: true},
	created_at: {type: Date, default: Date.now}
});

var Tracker = mongoose.model('Tracker', TrackerSchema);
module.exports = Tracker;
