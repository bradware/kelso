'use strict';

var mongoose = require('mongoose');

var GroupSchema = mongoose.Schema({
	name: {type: String, required: true, trim: true},
	viewers: [{
		_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Viewer'},
		name: {type: String, trim: true}
	}],
	content: {
		_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Content'},
		title: {type: String, trim: true}
	},
	created_at: {type: Date, default: Date.now}
});

var Group = mongoose.model('Group', GroupSchema);
module.exports = Group;
