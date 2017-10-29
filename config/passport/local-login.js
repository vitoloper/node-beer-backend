
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var LocalStrategy = require('passport-local').Strategy;
var User = mongoose.model('User');

/**
 * Expose
 */

module.exports = new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function (email, password, done) {
    User.findOne({'email': email}, function (err, user) {
      if (err)
        return done(err);

      if (!user)
        return done(null, false, {message: 'User not found'});

      if (!user.authenticate(password))
        return done(null, false, {message: 'Incorrect password'});

      // Login successful, return the user
      return done(null, user);
    });
  }
);
