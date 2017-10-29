'use strict';

/*
 * nodejs-express-mongoose
 * Copyright(c) 2015 Madhusudhan Srinivasa <madhums8@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies
 */

require('dotenv').config();

const fs = require('fs');
const join = require('path').join;
const express = require('express');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;  // mpromise is deprecated
const passport = require('passport');
const config = require('./config');

const models = join(__dirname, 'app/models');
const port = process.env.PORT || 3000;

const app = express();  // Express
const connection = connect(); // MongoDB connection

// *** Redis client connection ***
var redis = require('redis');
var redisClient;
redisClient = redis.createClient({host: config.redis.host, port: config.redis.port});

redisClient.on('ready', function () {
  console.log('Redis client ready');
});
redisClient.on('error', function (err) {
    console.log('redisClient Error: ', err);
});
// *** Redis client connection ***

/**
 * Expose
 */

module.exports = {
  app,
  connection
};

// Bootstrap models
fs.readdirSync(models)
  .filter(file => ~file.indexOf('.js'))
  .forEach(file => require(join(models, file)));

// Bootstrap routes
require('./config/passport')(passport);
require('./config/express')(app, passport, redisClient);
require('./config/routes')(app, passport);

connection
  .on('error', console.log)
  .on('disconnected', connect)
  .once('open', listen);

function listen () {
  if (app.get('env') === 'test') return;
  app.listen(port);
  console.log('Express app started on port ' + port);
}

function connect () {
  // Mongoose 4.11.x
  var options = {keepAlive: 5000, useMongoClient: true};
  var connection = mongoose.connect(config.db, options);
  return connection;
}
