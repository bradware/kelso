'use strict';

var mongoose = require('mongoose');

var RatingSchema = mongoose.Schema({
  tracker: {type: mongoose.Schema.Types.ObjectId, ref: 'Tracker', required: true},
  viewer: {type: mongoose.Schema.Types.ObjectId, ref: 'Viewer', required: true},
  rating: {type: String, enum: ['THUMBSUP', 'THUMBSDOWN', 'NEUTRAL'], required: true},
  created_at: {type: Date, default: Date.now}
});

var Rating = mongoose.model('Rating', RatingSchema);
module.exports = Rating;
