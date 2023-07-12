import Joi from 'joi';
import mongoose, { Schema, Document, model, Model, Types } from 'mongoose';

interface IRental extends Document {
  _id: mongoose.Types.ObjectId;
  customer: {
    name: string;
    isGold: boolean;
    phone: string;
  };
  movie: Types.ObjectId[];
  dateOut: Date;
  dateReturned?: Date;
  rentalFee?: number;
}

const rentalSchema: Schema = new Schema({
  customer: {
    type: new Schema({
      name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
      },
      isGold: {
        type: Boolean,
        default: false,
      },
      phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
      },
    }),
    required: true,
  },
  movie: [{ type: Schema.Types.ObjectId, ref: 'Movie' }],
  dateOut: {
    type: Date,
    required: true,
    default: Date.now,
  },
  dateReturned: {
    type: Date,
  },
  rentalFee: {
    type: Number,
    min: 0,
  },
});

const Rental: Model<IRental> = model<IRental>('Rental', rentalSchema);

function validate(rental: { customerId: string; movieId: string }) {
  const schema = {
    customerId: Joi.string().required(),
    movieId: Joi.string().required(),
  };

  return Joi.validate(rental, schema);
}

export { Rental, validate };