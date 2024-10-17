import Joi from 'joi';
import mongoose, { Schema, Document, model, Model, Types } from 'mongoose';
import { genreSchema } from './genre';

interface IMovie extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  image: string;
  genre: string;
  numberInStock: number;
  dailyRentalRate: number;
}

const movieSchema: Schema = new Schema({
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
    type: genreSchema,
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

const Movie: Model<IMovie> = model<IMovie>('Movie', movieSchema);

function validateMovie(movie: { title: string, image: string, genreId: string, numberInStock: number, dailyRentalRate: number }) {
  const schema = {
    title: Joi.string().min(5).max(50).required(),
    image: Joi.required(),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number().min(0).required(),
    dailyRentalRate: Joi.number().min(0).required()
  };

  return Joi.validate(movie, schema);
}

export { Movie, validateMovie };