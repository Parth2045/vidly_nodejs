"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const {User} = require('../../models/user');
const user_1 = require("../../models/user");
// const auth = require('../../middleware/auth');
const auth_1 = __importDefault(require("../../middleware/auth"));
// const mongoose = require('mongoose');
const mongoose_1 = __importDefault(require("mongoose"));
const globals_1 = require("@jest/globals");
describe('auth middleware', () => {
    it('should populate req.user with the payload of a valid JWT', () => {
        const user = {
            _id: new mongoose_1.default.Types.ObjectId().toHexString(),
            isAdmin: false
        };
        const token = new user_1.User(user).generateAuthToken();
        console.log(token);
        const req = {
            header: globals_1.jest.fn().mockReturnValue(token),
            user: globals_1.jest.fn().mockReturnValue(user)
        };
        const res = {};
        const next = globals_1.jest.fn();
        (0, auth_1.default)(req, res, next);
        expect(req.user).toMatchObject(user);
    });
});
