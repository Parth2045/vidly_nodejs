import Joi from 'joi';
import mongoose, { Schema, Document, model, Model } from 'mongoose';

interface IGenre extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  image: string;
  movies: object;
}

const genreSchema: Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  image: {
    type: String,
    default: null
  }
});

const Genre: Model<IGenre> = model<IGenre>('Genre', genreSchema);

function validateGenre(genre: { name: string, image: string }) {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    image: Joi.allow(null)
  };

  return Joi.validate(genre, schema);
}

export { genreSchema, Genre, validateGenre };