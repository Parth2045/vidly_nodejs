import jwt from 'jsonwebtoken';
import config from 'config';
import { Request, Response, NextFunction } from 'express';
interface CustomRequest extends Request {
  user?: any;
}

const auth = (req: CustomRequest, res: Response, next: NextFunction) => {
  const token = req.header('x-auth-token');

  // console.log("Token in Auth function: START");
  // console.log(token);
  // console.log("Token in Auth function: END");

  if (!token) return res.status(401).send('Access denied. No token provided.');

  try {
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