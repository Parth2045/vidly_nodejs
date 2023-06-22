import {Rental, validate} from '../models/rental.js';
import { Movie } from '../models/movie.js';
import { Customer } from '../models/customer.js';
import mongoose from 'mongoose'; 
import * as Fawn from 'fawn'; // Causing the error
import * as lodash from 'lodash';
const { reject } = lodash;

// Fawn.init('mongodb://0.0.0.0:27017/vidly');
const perPageLimit = 10;
const getRentals = async (req, res) => {
  let pageNo = (req.query.page !== undefined && req.query.page >= 0) ? req.query.page : 0; // DEFAULT 0 = PAGE NO 1
  pageNo = ((pageNo - 1) < 0) ? 0 : (pageNo - 1);
  const rentals = await Rental.find().sort('-dateOut').lean().select('-__v').skip(parseInt(pageNo) * perPageLimit).limit(perPageLimit);
  res.send({ rentals, recordCount: rentals.length, pageNo: pageNo + 1 });
};

const storeRental = async (req, res) => {
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
};

const getRental = async (req, res) => {
    const rental = await Rental.findById(req.params.id).lean().populate('movie'); // Popolate movie object
    // .lean() method for faster exicution | in response we will get POJO(Plain Old Javascript Object).
    // .populate('movie', 'title'); // Populated the other objects data, syntax: .populate('modelname', '(optional argument)<select column names>')
    // Populate is not working, please check properly
  
    if (!rental) return res.status(404).send('The rental with the given ID was not found.');
  
    res.send(rental);
};

export { getRentals, storeRental, getRental };