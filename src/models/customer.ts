import Joi from 'joi';
import mongoose, { Schema, Document, model, Model, Types } from 'mongoose';
import { hash } from 'bcrypt';

interface ICustomer extends Document {
  _id: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  isGold: boolean;
  phone: string;
  password: string;
  date: Date;
}

const customerSchema: Schema = new mongoose.Schema<ICustomer>({
  firstName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: true,
    minlength: 2,
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
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 50
  },
  date: {
    type: Date,
    default: Date.now
  }
});

customerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    this.password = await hash(this.password, 10);
    next();
  } catch (error) {
    return next(error);
  }
});

const Customer: Model<ICustomer> = model<ICustomer>('Customer', customerSchema);

function validateCustomer(customer: { firstName: string, lastName: string, phone: string, password: string, isGold: boolean }, isUpdate: boolean = false) {
  const schema = {
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    phone: Joi.string().min(5).max(50).required(),
    password: (isUpdate ? Joi.string().min(8).max(50) : Joi.string().min(8).max(50).required()),
    isGold: Joi.boolean()
  };

  return Joi.validate(customer, schema);
}

export { Customer, validateCustomer };