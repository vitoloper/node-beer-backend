'use strict';

/**
 * Module dependencies.
 */

const home = require('../app/controllers/home');
const beerController = require('../app/controllers/beer');

/**
 * Expose
 */

module.exports = function (app, passport) {

  app.get('/', home.index);

  // Beer routes
  app.get('/api/beers', isUser, beerController.get);
  app.get('/api/beers/:id', isUser, beerController.get);
  app.post('/api/beers', isUser, beerController.save);

  // Signup
  app.post('/api/local-signup', function(req, res, next) {
   passport.authenticate('local-signup', function(err, user, info) {
     // console.log(req.body);
     // console.log('err: ', err);
     // console.log('user: ', user);
     // console.log('info: ', info);

     if (err) { return next(err); }
     if (!user) { return res.status(401).json(info); }

     // Login after user creation
     req.logIn(user, function(err) {
       if (err)
         return next(err);

       return res.status(200).json(user);
     });
   })(req, res, next);
  });

  // Login
  app.post('/api/local-login', function(req, res, next) {
   passport.authenticate('local-login', function(err, user, info) {
     // console.log(req.body);
     // console.log('err: ', err);
     // console.log('user: ', user);
     // console.log('info: ', info);

     if (err) { return next(err); }
     if (!user) { return res.status(401).json(info); }
     req.logIn(user, function(err) {
       if (err)
         return next(err);

       return res.status(200).json(user);
     });
   })(req, res, next);
  });

  // Logout
  app.get('/api/local-logout', function (req, res) {
    req.logout();
    return res.status(200).json({message: 'Logout successful'});
  });

  // Get logged user data
  app.get('/api/user', function (req, res) {
    if (req.user) {
      return res.status(200).json(req.user);
    } else {
      return res.status(401).json({message: 'Not logged in'});
    }
  });

  // User authorization middleware
  function isUser(req, res, next) {
    // req.user is the session stored on the database
    if (req.isAuthenticated() && (req.user.role === 'admin' || req.user.role === 'user')) {
      return next();
    }

    return res.status(401).json({message: 'Unauthorized'});
  }

  // Admin authorization middleware
  function isAdmin(req, res, next) {
    // req.user is the session stored on the database
    if (req.isAuthenticated() && req.user.role === 'admin' ) {
      return next();
    }

    return res.status(401).json({message: 'Unauthorized'});
  }


  /**
   * Error handling
   */

  app.use(function (err, req, res, next) {
    // treat as 404
    if (err.message
      && (~err.message.indexOf('not found')
      || (~err.message.indexOf('Cast to ObjectId failed')))) {
      return next();
    }
    console.error(err.stack);
    // error page
    res.status(500).render('500', { error: err.stack });
  });

  // assume 404 since no middleware responded
  app.use(function (req, res, next) {
    res.status(404).render('404', {
      url: req.originalUrl,
      error: 'Not found'
    });
  });
};
