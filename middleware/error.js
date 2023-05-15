import * as winston from 'winston';
export default function (err, req, res, next) {
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