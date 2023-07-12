"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const {User} = require('../../models/user');
const user_1 = require("../../models/user");
// const {Genre} = require('../../models/genre');
const genre_1 = require("../../models/genre");
// const request = require('supertest');
const supertest_1 = __importDefault(require("supertest"));
const index_1 = __importDefault(require("../../index"));
// import { describe } from 'joi/lib/types/lazy/index.js';
describe('auth middleware', () => {
    beforeEach(() => { index_1.default; });
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield genre_1.Genre.remove({});
        index_1.default.close();
    }));
    let token;
    const exec = () => {
        return (0, supertest_1.default)(index_1.default)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({ name: 'genre1' });
    };
    beforeEach(() => {
        token = new user_1.User().generateAuthToken();
    });
    it('should return 401 if no token is provided', () => __awaiter(void 0, void 0, void 0, function* () {
        token = '';
        const res = yield exec();
        expect(res.status).toBe(401);
    }));
    it('should return 400 if token is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
        token = 'a';
        const res = yield exec();
        expect(res.status).toBe(400);
    }));
    it('should return 200 if token is valid', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield exec();
        expect(res.status).toBe(200);
    }));
});
