"use strict";
exports.__esModule = true;
var winston_1 = require("winston");
var express_1 = require("express");
var cors_1 = require("cors");
var app = express_1["default"]();
var logging_1 = require("./startup/logging");
logging_1["default"]();
// CORS
app.use(cors_1["default"]()); // USING THIS IT ALLOWS LOCAL APP TO ACCESS THE ENDPOINTS
var routes_1 = require("./startup/routes");
routes_1["default"](app); // Provide Reference of "app" object in route module
var db_1 = require("./startup/db");
db_1["default"]();
var config_1 = require("./startup/config");
config_1["default"]();
var validation_1 = require("./startup/validation");
validation_1["default"]();
var prod_1 = require("./startup/prod");
prod_1["default"](app);
var port = process.env.PORT || 4000;
var server = app.listen(port, function () { return winston_1["default"].info("Listening on port " + port + "..."); });
exports["default"] = server; // ES6 Syntax (Barrel)
