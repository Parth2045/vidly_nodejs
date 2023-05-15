import * as jwt from 'jsonwebtoken';
import * as config from 'config';

export default function (req, res, next) { // NEXT MEANS TO PASS CONTROL TO NEXT MIDDLEWARE FUNCTION IN THE REQUEST PROCESSING PIPELINE
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).send('Access denied. No token provided.');

  try {
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    req.user = decoded; 
    next();
  }
  catch (ex) {
    res.status(400).send('Invalid token.');
  }
};