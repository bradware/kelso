'use strict';

var mongoose = require('mongoose');

var SuggestionSchema = mongoose.Schema({
	group: {type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true},
	content: {type: mongoose.Schema.Types.ObjectId, ref: 'Content', required: true},
	created_at: {type: Date, default: Date.now}
});

var Suggestion = mongoose.model('Suggestion', SuggestionSchema);
module.exports = Suggestion;
