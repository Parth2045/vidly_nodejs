import {Rental, validate} from '../models/rental.js';
import { Movie } from '../models/movie.js';
import { Customer } from '../models/customer.js';
import mongoose from 'mongoose'; 
import * as Fawn from 'fawn'; // Causing the error
import * as express from 'express';
import * as lodash from 'lodash';
const { reject } = lodash;
const router = express.Router();

// Fawn.init('mongodb://0.0.0.0:27017/vidly');
router.get('/', async (req, res) => {
  const rentals = await Rental.find().sort('-dateOut');
  res.send(rentals);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send('Invalid customer.');

  let movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send('Invalid movie.');

  if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock.');

  const session = await mongoose.startSession();

  let rental = new Rental({ 
    customer: {
      _id: customer._id,
      name: customer.name, 
      phone: customer.phone
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate
    }
  });

  try {

    session.startTransaction();
    Movie.findByIdAndUpdate({_id: movie._id}, {
      $inc: { numberInStock: -1 }
    }, { new: true }).then((docs) => {
      // console.log(docs);
    }).catch((err) => {
      reject(err);
    });

    await rental.save();
    await session.commitTransaction();
    session.endSession();

    // new Fawn.Task()
    //   .save('rentals', rental)
    //   .update('movies', { _id: movie._id }, { 
    //     $inc: { numberInStock: -1 }
    //   })
    //   .run();
  
    res.send(rental);
  }
  catch(ex) {
    console.log(ex);
    await session.abortTransaction()
    session.endSession();
    res.status(500).send('Something failed.');
  }
});

router.get('/:id', async (req, res) => {
  const rental = await Rental.findById(req.params.id).lean(); // .lean() method for faster exicution | in response we will get POJO(Plain Old Javascript Object).
                            // .populate('movie', 'title'); // Populated the other objects data syntax: .populate('modelname', '(optional argument)<select column names>')

  if (!rental) return res.status(404).send('The rental with the given ID was not found.');

  res.send(rental);
});

export default router;