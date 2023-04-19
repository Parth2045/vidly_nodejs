const helmet = require('helmet');
const compression = require('compression');

module.exports = function(app) {
    app.use(helmet()); // We need to call in order to get middleware function
    app.use(compression());
};