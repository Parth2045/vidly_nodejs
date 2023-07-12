import winston from 'winston';
import mongoose from 'mongoose';
import config from 'config';

export default function startDB() {
  const db: string = config.get('db');
  mongoose.set("strictQuery", false);
  mongoose.connect(db)
    .then(() => winston.info(`Connected to ${db}...`));
};