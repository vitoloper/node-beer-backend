'use strict';

var supertest = require("supertest");
var should = require("should");
var mongoose = require('mongoose');
var {app, connection}  = require('../server');

// supertest agent
var agent = supertest.agent(app);

// Models
var User = mongoose.model('User');

describe('Authentication', function () {
  // Clean users collection
  before(function (done) {
    User.remove({}, function(err) {
      if (err) {
        return done(err);
      }

      // console.log('User collection removed');
      done();
    });
  });

  describe('signup', function () {
    it('should create a user', function (done) {
      supertest(app)
      .post('/api/local-signup')
      .type('form')
      .send({email: 'testsignup@localhost'})
      .send({password: 'testpwd'})
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        // Check if user exists in database
        User.findOne({_id: res.body._id}, function (err, user) {
          if (err) return done (err);

          should.exist(user);
          done();
        });
      });
    });
  });

  describe('signin', function () {
    var newUser;
    // Create a user
    before(function (done) {
      newUser = new User({email: 'signintest@localhost', password: 'testpwd', name: 'signintest'});
      newUser.save(function (err) {
        if (err) return done(err);
        return done();
      });
    });

    it('should login with an existing user', function (done) {
      supertest(app)
      .post('/api/local-login')
      .type('form')
      .send({email: 'signintest@localhost'})
      .send({password: 'testpwd'})
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        should(res.body.email).be.exactly('signintest@localhost');
        done();
      });
    });
  });
});
