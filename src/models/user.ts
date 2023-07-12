import config from 'config';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
  generateAuthToken(): string;
}

const userSchema: Schema<IUser> = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  isAdmin: Boolean,
});

userSchema.methods.generateAuthToken = function (): string {
  const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
  return token;
};

const User = mongoose.model<IUser>('User', userSchema);

class UserValidator {
  static validateUser(user: any): Joi.ValidationResult {
    const schema = {
      name: Joi.string().min(5).max(50).required(),
      email: Joi.string().min(5).max(255).required().email(),
      password: Joi.string().min(5).max(255).required(),
    };
    return Joi.validate(user, schema);
  }
}

export { User, UserValidator };