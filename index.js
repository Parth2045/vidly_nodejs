import winston from 'winston';
import express from 'express';
const app = express();

import startLogging from './startup/logging.js';
startLogging();

import startRoutes from './startup/routes.js';
startRoutes(app); // Provide Reference of "app" object in route module // THIS IS REMAINING FROM HERE

import startDB from './startup/db.js';
startDB();

import startConfig from './startup/config.js'
startConfig();

import startValidation from './startup/validation.js';
startValidation();

import startProd from './startup/prod.js';
startProd(app);


const port = process.env.PORT || 4000;
const server = app.listen(port, () => winston.info(`Listening on port ${port}...`));

// module.exports = server; // COMMONJS
export default server; // ES6 Syntax (Barrel)