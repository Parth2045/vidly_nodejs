"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pulicFolder = void 0;
exports.default = startConfig;
const config_1 = __importDefault(require("config"));
function startConfig() {
    if (!config_1.default.get('jwtPrivateKey')) {
        throw new Error('FATAL ERROR: jwtPrivateKey is not defined.');
    }
}
exports.pulicFolder = "public"; // ROOT PUBLIC FOLDER
