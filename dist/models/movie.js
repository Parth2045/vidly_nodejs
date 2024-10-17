"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Movie = void 0;
exports.validateMovie = validateMovie;
const joi_1 = __importDefault(require("joi"));
const mongoose_1 = require("mongoose");
const genre_1 = require("./genre");
const movieSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 255
    },
    image: {
        type: String,
        default: null
    },
    genre: {
        type: genre_1.genreSchema,
        required: true
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    }
});
const Movie = (0, mongoose_1.model)('Movie', movieSchema);
exports.Movie = Movie;
function validateMovie(movie) {
    const schema = {
        title: joi_1.default.string().min(5).max(50).required(),
        image: joi_1.default.required(),
        genreId: joi_1.default.objectId().required(),
        numberInStock: joi_1.default.number().min(0).required(),
        dailyRentalRate: joi_1.default.number().min(0).required()
    };
    return joi_1.default.validate(movie, schema);
}
