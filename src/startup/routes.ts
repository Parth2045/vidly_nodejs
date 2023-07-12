import express from 'express';
import genres from '../routes/genres';
import customers from '../routes/customers';
import movies from '../routes/movies';
import rentals from '../routes/rentals';
import users from '../routes/users';
import auth from '../routes/auth';
import error from '../middleware/error';

export default function startRoutes (app: any) {
  const rootPath = './public';
  app.use(express.static(rootPath)); // ROOT PATH | TO ACCESS STATIC FILES

  app.use(express.json()); // MIDDLEWARE
  app.use('/api/genres', genres);
  app.use('/api/customers', customers);
  app.use('/api/movies', movies);
  app.use('/api/rentals', rentals);
  app.use('/api/users', users);
  app.use('/api/auth', auth);
  app.use(error);
}