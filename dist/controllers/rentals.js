"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRental = exports.storeRental = exports.getRentals = void 0;
const rental_1 = require("../models/rental");
const movie_1 = require("../models/movie");
const customer_1 = require("../models/customer");
const mongoose_1 = __importDefault(require("mongoose"));
const lodash_1 = __importDefault(require("lodash"));
const { reject } = lodash_1.default;
const perPageLimit = 10;
const getRentals = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let pageNo = String(req.query.page);
    let pageNumber = parseInt(pageNo);
    pageNumber = (pageNumber !== undefined && pageNumber >= 0) ? pageNumber : 0; // DEFAULT 0 = PAGE NO 1
    const parsedPageNumber = ((pageNumber - 1) < 0) ? 0 : (pageNumber - 1);
    const rentals = yield rental_1.Rental.find().sort('-dateOut').lean().select('-__v').skip(parsedPageNumber * perPageLimit).limit(perPageLimit);
    res.send({ rentals, recordCount: rentals.length, pageNo: pageNo + 1 });
});
exports.getRentals = getRentals;
const storeRental = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, rental_1.validate)(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    const customer = yield customer_1.Customer.findById(req.body.customerId);
    if (!customer)
        return res.status(400).send('Invalid customer.');
    let movie = yield movie_1.Movie.findById(req.body.movieId);
    if (!movie)
        return res.status(400).send('Invalid movie.');
    if (movie.numberInStock === 0)
        return res.status(400).send('Movie not in stock.');
    const session = yield mongoose_1.default.startSession();
    let rental = new rental_1.Rental({
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
        movie_1.Movie.findByIdAndUpdate({ _id: movie._id }, {
            $inc: { numberInStock: -1 }
        }, { new: true }).then((docs) => {
            // console.log(docs);
        }).catch((err) => {
            reject(err);
        });
        yield rental.save();
        yield session.commitTransaction();
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
        yield session.abortTransaction();
        session.endSession();
        res.status(500).send('Something failed.');
    }
});
exports.storeRental = storeRental;
const getRental = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rental = yield rental_1.Rental.findById(req.params.id).lean().populate('movie'); // Popolate movie object
    // .lean() method for faster exicution | in response we will get POJO(Plain Old Javascript Object).
    // .populate('movie', 'title'); // Populated the other objects data, syntax: .populate('modelname', '(optional argument)<select column names>')
    // Populate is not working, please check properly
    if (!rental)
        return res.status(404).send('The rental with the given ID was not found.');
    res.send(rental);
});
exports.getRental = getRental;
