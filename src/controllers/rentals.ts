import { Request, Response } from 'express';
import { Rental, validate } from '../models/rental';
import { Movie } from '../models/movie';
import { Customer } from '../models/customer';
import mongoose from 'mongoose';
import lodash from 'lodash';
const { reject } = lodash;

const perPageLimit = 10;
const getRentals = async (req: Request, res: Response): Promise<any> => {
  let pageNo: string = String(req.query.page);
  let pageNumber: number = parseInt(pageNo);
  pageNumber = (pageNumber !== undefined && pageNumber >= 0) ? pageNumber : 0; // DEFAULT 0 = PAGE NO 1
  const parsedPageNumber: number = ((pageNumber - 1) < 0) ? 0 : (pageNumber - 1);

  const rentals = await Rental.find().sort('-dateOut').lean().select('-__v').skip(parsedPageNumber * perPageLimit).limit(perPageLimit);
  res.send({ rentals, recordCount: rentals.length, pageNo: pageNo + 1 });
};

const storeRental = async (req: Request, res: Response) => {
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
      firstName: customer.firstName,
      lastName: customer.lastName,
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
    Movie.findByIdAndUpdate({ _id: movie._id }, {
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
  catch (ex) {
    console.log(ex);
    await session.abortTransaction()
    session.endSession();
    res.status(500).send('Something failed.');
  }
};

const getRental = async (req: Request, res: Response) => {
  const rental = await Rental.findById(req.params.id).lean().populate('movie'); // Popolate movie object
  // .lean() method for faster exicution | in response we will get POJO(Plain Old Javascript Object).
  // .populate('movie', 'title'); // Populated the other objects data, syntax: .populate('modelname', '(optional argument)<select column names>')
  // Populate is not working, please check properly

  if (!rental) return res.status(404).send('The rental with the given ID was not found.');

  res.send(rental);
};

export { getRentals, storeRental, getRental };