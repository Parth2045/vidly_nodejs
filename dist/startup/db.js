"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("config"));
function startDB() {
    const db = config_1.default.get('db');
    mongoose_1.default.set("strictQuery", false);
    mongoose_1.default.connect(db)
        .then(() => winston_1.default.info(`Connected to ${db}...`));
}
exports.default = startDB;
;
