import winston from 'winston';
import express from 'express';
const app = express();

import startLogging from './startup/logging';
startLogging();

import startRoutes from './startup/routes';
startRoutes(app); // Provide Reference of "app" object in route module

import startDB from './startup/db';
startDB();

import startConfig from './startup/config'
startConfig();

import startValidation from './startup/validation';
startValidation();

import startProd from './startup/prod';
startProd(app);


const port = process.env.PORT || 4000;
const server = app.listen(port, () => winston.info(`Listening on port ${port}...`));

export default server; // ES6 Syntax (Barrel)