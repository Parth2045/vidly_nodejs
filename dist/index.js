"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const logging_1 = __importDefault(require("./startup/logging"));
(0, logging_1.default)();
// CORS
app.use((0, cors_1.default)()); // USING THIS IT ALLOWS LOCAL APP TO ACCESS THE ENDPOINTS
const routes_1 = __importDefault(require("./startup/routes"));
(0, routes_1.default)(app); // Provide Reference of "app" object in route module
const db_1 = __importDefault(require("./startup/db"));
(0, db_1.default)();
const config_1 = __importDefault(require("./startup/config"));
(0, config_1.default)();
const validation_1 = __importDefault(require("./startup/validation"));
(0, validation_1.default)();
const prod_1 = __importDefault(require("./startup/prod"));
(0, prod_1.default)(app);
const port = process.env.PORT || 4000;
const server = app.listen(port, () => winston_1.default.info(`Listening on port ${port}...`));
exports.default = server; // ES6 Syntax (Barrel)
