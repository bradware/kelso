'use strict';

var mongoose = require('mongoose');

var GroupSchema = mongoose.Schema({
	name: {type: String, required: true, trim: true},
	viewers: [{type: mongoose.Schema.Types.ObjectId, ref: 'Viewer', required: true}],
	created_at: {type: Date, default: Date.now}
});

var Group = mongoose.model('Group', GroupSchema);
module.exports = Group;
