import Joi from 'joi';
import mongoose, { Schema, Document, model, Model, Types } from 'mongoose';

interface ICustomer extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  isGold: boolean;
  phone: string;
  date: Date;
}

const customerSchema: Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  isGold: {
    type: Boolean,
    default: false
  },
  phone: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  date: {
    type: Date, default: Date.now
  }
});

const Customer: Model<ICustomer> = model<ICustomer>('Customer', customerSchema);

function validateCustomer(customer: { name: string, phone: string, isGold: boolean }) {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    phone: Joi.string().min(5).max(50).required(),
    isGold: Joi.boolean()
  };

  return Joi.validate(customer, schema);
}

export { Customer, validateCustomer };