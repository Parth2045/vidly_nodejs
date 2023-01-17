const winston = require('winston');

module.exports = function(err, req, res, next){ // Express Error Middleware
    // winston.log('error', err.message);
    // or alternative, helper function
  winston.error(err.message, err);

  // error
  // warn
  // info
  // verbose
  // debug 
  // silly

  res.status(500).send('Something failed.');
}