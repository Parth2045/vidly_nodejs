import validateObjectId from '../middleware/validateObjectId.js';
import auth from '../middleware/auth.js';
import admin from '../middleware/admin.js';
import { Genre, validateGenre } from '../models/genre.js';
import * as express from 'express';
const router = express.Router();

router.get('/', async (req, res) => {
  const genres = await Genre.find().sort('name').lean();
  res.send(genres);
});

router.post('/', auth, async (req, res) => {
  const { error } = validateGenre(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let genre = new Genre({ name: req.body.name });
  genre = await genre.save();
  
  res.send(genre);
});

router.put('/:id', async (req, res) => {
  const { error } = validateGenre(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
    new: true
  }).lean().select('_id name');

  if (!genre) return res.status(404).send('The genre with the given ID was not found.');
  
  res.send(genre);
});

router.delete('/:id', [auth, admin], async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);

  if (!genre) return res.status(404).send('The genre with the given ID was not found.');

  res.send(genre);
});

router.get('/:id', validateObjectId, async (req, res) => {
  const genre = await Genre.findById(req.params.id).lean();

  if (!genre) return res.status(404).send('The genre with the given ID was not found.');

  res.send(genre);
});

export default router;