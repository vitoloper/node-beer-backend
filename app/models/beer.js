
/*!
 * Module dependencies
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Beer schema
 */

var BeerSchema = new Schema({
  name: {type: 'String', unique: true},
  description: {type: 'String', default: 'No description available'},
  quantity: {type: 'Number', default: 1},
  price: {type: 'Number'}
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

mongoose.model('Beer', BeerSchema);
