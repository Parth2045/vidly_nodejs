"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const genres_1 = __importDefault(require("../routes/genres"));
const customers_1 = __importDefault(require("../routes/customers"));
const movies_1 = __importDefault(require("../routes/movies"));
const rentals_1 = __importDefault(require("../routes/rentals"));
const users_1 = __importDefault(require("../routes/users"));
const auth_1 = __importDefault(require("../routes/auth"));
const error_1 = __importDefault(require("../middleware/error"));
function startRoutes(app) {
    const rootPath = './public';
    app.use(express_1.default.static(rootPath)); // ROOT PATH | TO ACCESS STATIC FILES
    app.use(express_1.default.json()); // MIDDLEWARE
    app.use('/api/genres', genres_1.default);
    app.use('/api/customers', customers_1.default);
    app.use('/api/movies', movies_1.default);
    app.use('/api/rentals', rentals_1.default);
    app.use('/api/users', users_1.default);
    app.use('/api/auth', auth_1.default);
    app.use(error_1.default);
}
exports.default = startRoutes;
