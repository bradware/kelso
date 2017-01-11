'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

var ViewerSchema = mongoose.Schema({
	name: {type: String, required: true, trim: true},
	age: {type: Number},
	gender: {type: String, enum: ['MALE', 'FEMALE']},
	email: {type: String, required: true, unique: true, trim: true},
	other_viewers: [{type: mongoose.Schema.Types.ObjectId, ref: 'Viewer'}],
	password: {type: String},
	created_at: {type: Date, default: Date.now}
});

// Authenticate user against database
ViewerSchema.statics.authenticate = function(email, password, callback) {
	Viewer.findOne({email: email}).exec(function(error, viewer) {
		if (error) {
			// Mongo returned an error
			callback(error);
		} else if (!viewer) { 
			// No user was found
			var err = new Error('Email not found');
			err.status = 401;
			callback(err);
		} else { 
			if (password === viewer.password) {
				// Password matched, returning the user
				return callback(null, viewer);
			} else {
				// Password did not match the email
				var err = new Error('Wrong password');
				err.status = 401;
				return callback(err, null);
			}
		}
	});
}

// Hash & Salt password, ssn4 before saving to Mongo
/**
ViewerSchema.pre('save', function(next) {
	// Salts & hashes password
	var viewer = this;
	bcrypt.hash(viewer.password, SALT_ROUNDS, function(err, hash) {
		if (err) {
			return next(err);
		} else {
			viewer.password = hash;
			next();
		}
	});
});
*/

var Viewer = mongoose.model('Viewer', ViewerSchema);
module.exports = Viewer;
