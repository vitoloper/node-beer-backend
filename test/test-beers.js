'use strict';

var supertest = require("supertest");
var should = require("should");
var mongoose = require('mongoose');
var {app, connection}  = require('../server');

// Models
var Beer = mongoose.model('Beer');

describe('Beers (no authentication)', function () {
  // Clean the beers collection before testing
  before(function (done) {
    Beer.remove({}, function(err) {
      if (err) {
        return done(err);
      }

      // console.log('Beer collection removed');
      done();
    });
  });

  describe('GET /api/beers', function () {
    it('should return not authorized', function (done) {
      supertest(app)
      .get('/api/beers')
      // .expect("Content-type",/json/)
      .expect(401)
      .end(function (err, res) {
        // NOTE: The .expect() failures are handled by err and is
        // properly passed to done. You may also add logging
        // or other functionality here, as needed.
        if (err) {
          return done(err);
        }
        res.body.message.should.be.exactly('Unauthorized');
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

    it('should return not authorized', function (done) {
      supertest(app)
      .get('/api/beers/'+savedBeerId)
      // .expect("Content-type",/json/)
      .expect(401)
      .end(function (err, res) {
        // NOTE: The .expect() failures are handled by err and is
        // properly passed to done. You may also add logging
        // or other functionality here, as needed.
        if (err) {
          return done(err);
        }
        res.body.message.should.be.exactly('Unauthorized');
        // console.log(res.body);
        done();
      });
    });
  });

  describe('POST /api/beers', function() {
    it('should return not authorized', function(done) {
      supertest(app)
      .post('/api/beers')
      .set('Content-type', 'application/json; charset=utf-8')
      .send({'name': 'postTestBeer'})
      .expect(401)
      .end(function (err, res) {
        if (err) {
          return done(err);
        }
        done();
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

    it('should return not authorized', function(done) {
      supertest(app)
      .put('/api/beers/'+savedBeerId)
      .set('Content-type', 'application/json; charset=utf-8')
      .send({'description': 'fresh beer test'})
      .expect(401)
      .end(function (err, res) {
        if (err) {
          return done(err);
        }
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

    it('should return not authorized', function(done) {
      supertest(app)
      .delete('/api/beers/'+savedBeerId)
      .expect(401)
      .end(function (err, res) {
        if (err) {
          return done(err);
        }
        done();
      });
    });
  });


}); // Beers (no authentication)
