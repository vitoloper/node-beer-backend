
/*!
 * Module dependencies
 */

var mongoose = require('mongoose');
var crypto = require('crypto');
var Schema = mongoose.Schema;

/**
 * User schema
 */

var UserSchema = new Schema({
  name: { type: String, default: '' },
  email: { type: String, default: '' },
  password: { type: String, default: '' },
  salt: { type: String, default: '' },
  role: {type: 'String', enum: ['user', 'admin'], default: 'user'}
});

/**
 * User plugin
 */

// UserSchema.plugin(userPlugin, {});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Hook a pre save method to hash the password
 */
UserSchema.pre('save', function (next) {
  // Save only if password is password is not empty and longer than 3 characters
  if (this.password && this.isModified('password') && this.password.length >= 3) {
    this.salt = crypto.randomBytes(16).toString('base64');
    this.password = this.hashPassword(this.password);
  }

  next();
});

/**
 * Create instance method for hashing a password
 * PBKDF2: password based key derivation function 2
 */
UserSchema.methods.hashPassword = function (password) {
  if (this.salt && password) {
    return crypto.pbkdf2Sync(password, new Buffer(this.salt, 'base64'), 10000, 128, 'sha1').toString('base64');
  } else {
    return password;
  }
};

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function (password) {
  return this.password === this.hashPassword(password);
};

/**
 * Methods
 */

UserSchema.method({

});
/**
 * Statics
 */

UserSchema.static({

});

/**
 * Register
 */

mongoose.model('User', UserSchema);
