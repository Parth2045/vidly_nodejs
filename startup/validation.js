import Joi from 'joi';
import objectId from 'joi-objectid';

export default function startValidation() {
  Joi.objectId = objectId(Joi);
}