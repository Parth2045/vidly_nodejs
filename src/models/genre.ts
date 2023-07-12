import Joi from 'joi';
import mongoose, { Schema, Document, model, Model, Types } from 'mongoose';

interface IGenre extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
}

const genreSchema: Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  }
});

const Genre: Model<IGenre> = model<IGenre>('Genre', genreSchema);

function validateGenre(genre: { name: string }) {
  const schema = {
    name: Joi.string().min(5).max(50).required()
  };

  return Joi.validate(genre, schema);
}

export { genreSchema, Genre, validateGenre };