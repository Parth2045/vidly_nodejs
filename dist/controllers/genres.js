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
exports.getGenre = exports.deleteGenre = exports.updateGenre = exports.storeGenres = exports.getGenres = void 0;
const genre_1 = require("../models/genre");
const getGenres = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const genres = yield genre_1.Genre.find().sort('name').lean();
    res.send(genres);
});
exports.getGenres = getGenres;
const storeGenres = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, genre_1.validateGenre)(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    let genre = new genre_1.Genre({ name: req.body.name });
    genre = yield genre.save();
    res.send(genre);
});
exports.storeGenres = storeGenres;
const updateGenre = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, genre_1.validateGenre)(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    const genre = yield genre_1.Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
        new: true
    }).lean().select('_id name');
    if (!genre)
        return res.status(404).send('The genre with the given ID was not found.');
    res.send(genre);
});
exports.updateGenre = updateGenre;
const deleteGenre = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const genre = yield genre_1.Genre.findByIdAndRemove(req.params.id);
    if (!genre)
        return res.status(404).send('The genre with the given ID was not found.');
    res.send(genre);
});
exports.deleteGenre = deleteGenre;
const getGenre = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const genre = yield genre_1.Genre.findById(req.params.id).lean();
    if (!genre)
        return res.status(404).send('The genre with the given ID was not found.');
    res.send(genre);
});
exports.getGenre = getGenre;
