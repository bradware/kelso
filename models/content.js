'use strict';

var mongoose = require('mongoose');

var ContentSchema = mongoose.Schema({
	title: {type: String, required: true, trim: true},
	image_path: {type: String, trim: true},
	description: {type: String, trim: true},
	source: {type: String, enum: ['BROADCAST', 'CABLE', 'ONDEMAND', 'STREAMING', 'DVR', 'NETFLIX', 'HULU', 'HBOGO'], required: true},
	popularity: {type: String, enum: ['1', '2', '3', '4', '5']},
	season_num: {type: Number},
	episode_num: {type: Number},
	created_at: {type: Date, default: Date.now}
});

var Content = mongoose.model('Content', ContentSchema);
module.exports = Content;
