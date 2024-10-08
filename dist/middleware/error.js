"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const winston_1 = __importDefault(require("winston"));
function default_1(err, req, res, next) {
    // winston.log('error', err.message);
    // or alternative, helper function
    winston_1.default.error(err.message, err);
    // error
    // warn
    // info
    // verbose
    // debug 
    // silly
    res.status(500).send('Something failed.');
}
