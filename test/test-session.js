'use strict';

var supertest = require("supertest");
var should = require("should");
var redis = require('redis');
var {app, connection, redisClient}  = require('../server');

describe('Session', function () {
  // Clear all sessions on Redis
  before(function (done) {
    redisClient.flushdb(function (err, reply) {
      if (err) return done(err);
      done();
    });
  });

  describe('Redis session', function () {
    it('should persist after a connection', function (done) {
      supertest(app)
      .get('/')
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);

        // One session should be present on the database
        redisClient.keys('*', function (err, replies) {
          if (err) return done(err);
          should(replies).have.length(1);
          done();
        });
      });
    }); // it
  }); // describe

});
