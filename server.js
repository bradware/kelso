'use strict';

require('rootpath')();

// Required modules
var express = require('express');
var mongoose = require('mongoose');
var helmet = require('helmet');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

// Required routes
var registerRoute = require('routes/register');
var loginRoute = require('routes/login');
var viewerRoute = require('routes/viewer');
var contentRoute = require('routes/content');
var trackerRoute = require('routes/tracker');
var mainRoutes = require('routes/main');

// Constants
var port = process.env.PORT || 3001;
var api_route_prefix = '/api/';

// Create our Express application
var app = express();

// MongoDB setup
var mongodb_local_uri = 'mongodb://localhost:27017/kelso';
var mongodb_uri = process.env.MONGODB_URI || mongodb_local_uri;
mongoose.connect(mongodb_uri);
mongoose.Promise = global.Promise;
var db = mongoose.connection;

db.on('error', function(err) { 
  console.error('Connection error to Moola DB:', err); 
});

// Middleware setup
app.use(logger('dev'));
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

// Makes static assets available
app.use(express.static('public'));

// Session & Token management setup
var sess = {
  secret: 'kelso-secret-key',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({mongooseConnection: db}),
  cookie: {maxAge: 3600000} // 60 minute expiration for session
};
app.use(session(sess));

// UI routes
app.use(mainRoutes);

// Connect all our api routes with prefix /api
app.use(api_route_prefix, registerRoute);
app.use(api_route_prefix, loginRoute);
app.use(api_route_prefix, viewerRoute);
app.use(api_route_prefix, contentRoute);
app.use(api_route_prefix, trackerRoute);

// Catch unused requests
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler, has to take in 4 params
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});

app.listen(port, function() { 
  console.log('Server is running on port', port); 
});
