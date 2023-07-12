"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const {User} = require('../../../models/user');
const user_1 = require("../../../models/user");
// const jwt = require('jsonwebtoken');
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// const config = require('config');
const config_1 = __importDefault(require("config"));
// const mongoose = require('mongoose');
const mongoose_1 = __importDefault(require("mongoose"));
describe('user.generateAuthToken', () => {
    it('should return a valid JWT', () => {
        const payload = {
            _id: new mongoose_1.default.Types.ObjectId().toHexString(),
            isAdmin: true
        };
        const user = new user_1.User(payload);
        const token = user.generateAuthToken();
        const decode = jsonwebtoken_1.default.verify(token, config_1.default.get('jwtPrivateKey'));
        expect(decode).toMatchObject(payload);
    });
});
