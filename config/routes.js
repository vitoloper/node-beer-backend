'use strict';

/**
 * Module dependencies.
 */

const home = require('../app/controllers/home');

/**
 * Expose
 */

module.exports = function (app, passport) {

  app.get('/', home.index);

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
