"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("config"));
const auth = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token)
        return res.status(401).send('Access denied. No token provided.');
    try {
        console.log(token);
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.get('jwtPrivateKey'));
        req.user = decoded;
        next();
    }
    catch (ex) {
        console.log(ex);
        res.status(400).send('Invalid token.');
    }
};
exports.default = auth;
