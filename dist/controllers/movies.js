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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMovie = exports.deleteMovie = exports.updateMovie = exports.storeMovie = exports.getMovies = void 0;
const movie_1 = require("../models/movie");
const genre_1 = require("../models/genre");
const getMovies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const movies = yield movie_1.Movie.find().sort('name').lean().select('-__v');
    res.send(movies);
});
exports.getMovies = getMovies;
const storeMovie = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, movie_1.validateMovie)(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    const genre = yield genre_1.Genre.findById(req.body.genreId).lean();
    if (!genre)
        return res.status(400).send('Invalid genre.');
    const movie = new movie_1.Movie({
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });
    yield movie.save();
    res.send(movie);
});
exports.storeMovie = storeMovie;
const updateMovie = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, movie_1.validateMovie)(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    const genre = yield genre_1.Genre.findById(req.body.genreId).lean();
    if (!genre)
        return res.status(400).send('Invalid genre.');
    const movie = yield movie_1.Movie.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    }, { new: true }).lean();
    if (!movie)
        return res.status(404).send('The movie with the given ID was not found.');
    res.send(movie);
});
exports.updateMovie = updateMovie;
const deleteMovie = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const movie = yield movie_1.Movie.findByIdAndRemove(req.params.id).lean().select('-__v');
    if (!movie)
        return res.status(404).send('The movie with the given ID was not found.');
    res.send(movie);
});
exports.deleteMovie = deleteMovie;
const getMovie = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const movie = yield movie_1.Movie.findById(req.params.id).lean().select('-__v');
    if (!movie)
        return res.status(404).send('The movie with the given ID was not found.');
    res.send(movie);
});
exports.getMovie = getMovie;
