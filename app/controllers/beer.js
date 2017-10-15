var mongoose = require('mongoose');
var Beer = mongoose.model('Beer');

/**
 * Save a beer.
 *
 */
exports.save = function (req, res) {
  var name = req.body.name;
  var description = req.body.description;
  var quantity = req.body.quantity;
  var price = req.body.price;
  var newBeer = new Beer();

  if (!req.body || !req.body.name) {
    return res.status(400).json({message: 'Missing "name" parameter'});
  }

  newBeer.name = name;
  if (description) newBeer.description = description;
  if (quantity) newBeer.quantity = quantity;
  if (price) newBeer.price = price;

  newBeer.save(function (err) {
    if (err) {
      console.log(err);
      if (err.code === 11000) {
        return res.status(500).json({message: 'A beer with the same name already exists'});
      } else {
        return res.status(500).json({message: 'Beer saving error'});
      }
    }

    return res.status(200).json(newBeer);
  });

};

/**
 * Get a beer or get all beers.
 *
 */
exports.get = function (req, res, next) {
  var id = req.params.id;

  // Get all beers if no id param in url
  if (!id) {
    Beer.find({}, function (err, beers) {
     if (err) {
       console.log(err.stack);
       return res.status(500).json({message: 'Beer get error'});
     }

     return res.status(200).json(beers);
   });
 } else {
    Beer.findOne({_id: id}, function (err, beer) {
      if (err) {
        console.log(err.stack);
        return res.status(500).json({message: 'Beer get error'});
      }

      if (!beer)
        return res.status(200).json({});

      return res.status(200).json(beer);
    });
  }
}
