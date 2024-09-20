import winston from 'winston';
import express from 'express';
import cors from 'cors'; // ADDED DUE TO CORS ISSUE
const app = express();

// ADDED DUE TO CORS ISSUE
app.use(cors());
// app.options('*', cors());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
// ADDED DUE TO CORS ISSUE

import startLogging from './startup/logging';
startLogging();

import startRoutes from './startup/routes';
startRoutes(app); // Provide Reference of "app" object in route module // THIS IS REMAINING FROM HERE

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