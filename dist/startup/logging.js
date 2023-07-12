"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
require("express-async-errors");
function startLogging() {
    winston_1.default.handleExceptions(new winston_1.default.transports.Console({ colorize: true, prettyPrint: true }), new winston_1.default.transports.File({ filename: 'uncaughtExceptions.log' }));
    process.on('unhandledRejection', (ex) => {
        throw ex;
    });
    winston_1.default.add(winston_1.default.transports.File, { filename: 'logfile.log' });
}
exports.default = startLogging;
