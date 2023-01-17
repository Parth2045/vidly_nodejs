const winston = require('winston');
const express = require('express');
const app = express();

require('./startup/logging');
require('./startup/routes')(app); // Provide Reference of "app" object in route module
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();

const port = process.env.PORT || 4000;
app.listen(port, () => winston.info(`Listening on port ${port}...`));