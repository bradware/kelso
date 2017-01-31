'use strict';

var mongoose = require('mongoose');

var ViewerSchema = mongoose.Schema({
  name: {type: String, required: true, trim: true},
  age: {type: Number},
  gender: {type: String, enum: ['MALE', 'FEMALE']},
  email: {type: String, required: true, unique: true, trim: true, lowercase: true},
  other_viewers: [{
    _id: {type: mongoose.Schema.Types.ObjectId, ref: 'Viewer'},
    name: {type: String, trim: true},
    email: {type: String, trim: true, lowercase: true}
  }],
  content: [{
    _id: {type: mongoose.Schema.Types.ObjectId, ref: 'Content'},
    title: {type: String, trim: true}
  }],
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

var Viewer = mongoose.model('Viewer', ViewerSchema);
module.exports = Viewer;
