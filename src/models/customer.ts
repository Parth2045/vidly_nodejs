import Joi from 'joi';
import mongoose, { Schema, Document, model, Model, UpdateQuery } from 'mongoose';
import { hash } from 'bcrypt';

const SALT_WORK_FACTOR: number = 10;
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
    this.password = await hash(this.password, SALT_WORK_FACTOR);
    next();
  } catch (error) {
    return next(error);
  }
});

customerSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate() as UpdateQuery<ICustomer>;
  try {
    if (update && update.password) {
      update.password = await hash(update.password, SALT_WORK_FACTOR);
    }
    next();
  } catch (error) {
    return next(error);
  }
});

const Customer: Model<ICustomer> = model<ICustomer>('Customer', customerSchema);

function validateCustomer(customer: { firstName: string, lastName: string, phone: string, password: string, isGold: boolean }) {
  const schema = {
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    phone: Joi.string().min(5).max(50).required(),
    password: Joi.string().min(8).max(50).required(),
    isGold: Joi.boolean()
  };

  return Joi.validate(customer, schema);
}

function validateCustomerUpdate(customer: { firstName: string, lastName: string, phone: string, password: string, isGold: boolean }) {
  const schema = {
    firstName: Joi.string().min(2).max(50),
    lastName: Joi.string().min(2).max(50),
    phone: Joi.string().min(5).max(50),
    password: Joi.string().min(8).max(50),
    isGold: Joi.boolean()
  };
  return Joi.validate(customer, schema);
}

export { Customer, validateCustomer, validateCustomerUpdate };