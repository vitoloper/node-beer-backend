'use strict';

var supertest = require("supertest");
var should = require("should");
var mongoose = require('mongoose');
var {app, connection}  = require('../server');

// supertest agent
var agent = supertest.agent(app);

// Models
var Beer = mongoose.model('Beer');
var User = mongoose.model('User');

describe('Beers (authentication)', function () {
  var savedUser;

  // Remove beers collection, remove users collection, create a test user, login.
  before(function() {
    return Beer.remove({})
    .then(function () {
      // console.log('Beer collection removed');
      return User.remove({});
    })
    .then(function() {
      // console.log('User collection removed');
      var user = new User({email: 'testuser@localtest.io', password: 'testuser', name: 'testuser'});
      return user.save();
    })
    .then(function (result) {
      // console.log('savedUser:', result);
      savedUser = result;
    })
    .then(function () {
      // Login
      return agent
      .post('/api/local-login')
      .type('form')
      .send({email: savedUser.email})
      .send({password: 'testuser'})
      .expect(200);
    })
    .then(function (res) {
      // console.log(res.body);
    })
    .catch(function (err) {
      console.log(err);
      throw err;
    });

  });

  describe('GET /api/beers', function () {
    it('should return an array of beers', function (done) {
      agent
      .get('/api/beers')
      // .expect("Content-type",/json/)
      .expect(200)
      .end(function (err, res) {
        // NOTE: The .expect() failures are handled by err and is
        // properly passed to done. You may also add logging
        // or other functionality here, as needed.
        if (err) {
          return done(err);
        }
        should(res.body).be.an.Array();
        // console.log(res.body);
        done();
      });
    });
  });

  describe('GET /api/beers/:id', function () {
    var savedBeerId;

    before(function (done) {
      var beer = new Beer({name: 'testBeer'});
      beer.save(function (err, savedBeer) {
        if (err) {
          return done(err);
        }
        // console.log('Saved beer id:',savedBeer.id);
        savedBeerId = savedBeer.id;
        done();
      });
    });

    it('should return a beer', function (done) {
      agent
      .get('/api/beers/'+savedBeerId)
      // .expect("Content-type",/json/)
      .expect(200)
      .end(function (err, res) {
        // NOTE: The .expect() failures are handled by err and is
        // properly passed to done. You may also add logging
        // or other functionality here, as needed.
        if (err) return done(err);

        should(res.body.name).be.exactly('testBeer');
        done();
      });
    });
  });

  describe('POST /api/beers', function() {
    it('should save a beer', function(done) {
      agent
      .post('/api/beers')
      .set('Content-type', 'application/json; charset=utf-8')
      .send({'name': 'authPostTestBeer'})
      .expect(200)
      .end(function (err, res) {
        if (err) {
          return done(err);
        }

        // Check if authPostTestBeer exists
        Beer.findOne({name: 'authPostTestBeer',}, function (err, result) {
          if (err) return done(err);

          should(result).have.property('name', 'authPostTestBeer');
          done();
        });
      });
    });
  });

  describe('PUT /api/beers/:id', function() {
    var savedBeerId;

    before(function (done) {
      var beer = new Beer({name: 'testPutBeer'});
      beer.save(function (err, savedBeer) {
        if (err) {
          return done(err);
        }
        // console.log('Saved beer id:',savedBeer.id);
        savedBeerId = savedBeer.id;
        done();
      });
    });

    it('should update a beer', function(done) {
      agent
      .put('/api/beers/'+savedBeerId)
      .set('Content-type', 'application/json; charset=utf-8')
      .send({'description': 'fresh beer test'})
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);

        should(res.body.description).be.exactly('fresh beer test');
        done();
      });
    });
  });

  describe('DELETE /api/beers/:id', function() {
    var savedBeerId;

    before(function (done) {
      var beer = new Beer({name: 'testDeleteBeer'});
      beer.save(function (err, savedBeer) {
        if (err) {
          return done(err);
        }
        // console.log('Saved beer id:',savedBeer.id);
        savedBeerId = savedBeer.id;
        done();
      });
    });

    it('should remove a beer', function(done) {
      agent
      .delete('/api/beers/'+savedBeerId)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
    });
  });

}); // Beers (authentication)
