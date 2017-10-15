
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

      // User already exists
      if (user) {
        return done(null, false, {message: 'Email already exists'});
      }

      // Create the user
      var newUser = new User();
      newUser.email = email;
      newUser.password = password;  // The pre-save hook hashes the password before saving
      newUser.name = email.split('@')[0];

      newUser.save(function (err) {
        if (err)
          return done(err);

        // New user successfully created
        return done(null, newUser);
      });
    });

  }
);
