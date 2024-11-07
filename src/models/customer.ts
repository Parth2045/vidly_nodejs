import Joi from 'joi';
import mongoose, { Schema, Document, model, Model, UpdateQuery } from 'mongoose';
import { hash, compare } from 'bcrypt';
import jwt from 'jsonwebtoken';

const SALT_WORK_FACTOR: number = 10;

const JWT_SECRET: string = '17c748b44fa7d672c97d2d0063156dba41bdcb23d1c95e57f7eb961245adac6f473f4a02a83f80bbeb126e03bdf9faac2661b9c408822941275e5adf0ee6200ecfca1ebabef7cff418a53c5a22158d82b22c32d4d0b06b74ad7720cbb505ed1d3219045c5fa90b8786e96471efff7d1a1b321fa3e4c4cdaae3f3d8d9f2dc7698c42c84a81b9784f3f970e121f52e2534f1c1db84f22cf1e0694774a56981abd9cb90dfbf314f8b114048fc166b937e5da323ee5e339149a54a44c3d5f32f69740323278f941754e67371dda2cd12b2a6dbcd0a848faedafeae5d18cb030b194b80466e3755edeea131313539d947551c5976f729f553987add7e282926f00471';
const JWT_EXPIRE_TIME = 3600; // IN SECONDS
interface ICustomer extends Document {
  _id: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  isGold: boolean;
  phone: string;
  password: string;
  date: Date;
  isValidPassword: (password: string) => Promise<boolean>;
  customerToken: (customer: object) => Promise<string>;
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
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
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

customerSchema.method('isValidPassword', async function (password: string) {
  return await compare(password, this.password);
});

customerSchema.method('customerToken', async function (customer: object) {
  return jwt.sign({
    data: customer
  },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRE_TIME });
});

const Customer: Model<ICustomer> = model<ICustomer>('Customer', customerSchema);

function validateCustomer(customer: { firstName: string, lastName: string, email: string, phone: string, password: string, isGold: boolean }) {
  const schema = {
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    email: Joi.string().min(5).max(255).required(),
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

function validateEmailPassword(customer: { email: string, password: string }) {
  const schema = {
    email: Joi.string().min(5).max(255).required(),
    password: Joi.string().min(8).max(50).required()
  };
  return Joi.validate(customer, schema);
}

function isEmailExist(email: string) {
  return Customer.findOne({ email });
}

export { Customer, validateCustomer, validateCustomerUpdate, isEmailExist, validateEmailPassword };