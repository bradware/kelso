'use strict';

var mongoose = require('mongoose');

var TrackerSchema = mongoose.Schema({
	viewer: {
		type: {
			_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Viewer'},
			name: {type: String, trim: true},
			email: {type: String, trim: true},
		}, 
		required: true
	},
	other_viewers: [{
		_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Viewer'},
		name: {type: String, trim: true},
		email: {type: String, trim: true}
	}],
	content: {
		_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Content'},
		title: {type: String, trim: true}
	},
	created_at: {type: Date, default: Date.now}
});

var Tracker = mongoose.model('Tracker', TrackerSchema);
module.exports = Tracker;
