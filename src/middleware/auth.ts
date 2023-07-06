import jwt from 'jsonwebtoken';
import config from 'config';
import { Request, Response } from 'express';

const auth = (req: Request, res: Response, next: any) => { // NEXT MEANS TO PASS CONTROL TO NEXT MIDDLEWARE FUNCTION IN THE REQUEST PROCESSING PIPELINE
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).send('Access denied. No token provided.');

  try {
    console.log(token);
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    req.user = decoded; 
    next();
  }
  catch (ex) {
    console.log(ex);
    res.status(400).send('Invalid token.');
  }
};

export default auth;