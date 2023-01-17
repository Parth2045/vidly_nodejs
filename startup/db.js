const winston = require('winston');
const mongoose = require('mongoose');

module.exports = function() {
  mongoose.set("strictQuery", false);
  mongoose.connect('mongodb://0.0.0.0:27017/vidly')
    .then(() => winston.info('Connected to MongoDB...'));
}