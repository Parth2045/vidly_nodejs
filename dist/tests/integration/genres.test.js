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
// const request = require('supertest');
const supertest_1 = __importDefault(require("supertest"));
// const {Genre} = require('../../models/genre');
const genre_1 = require("../../models/genre");
// const {User} = require('../../models/user');
const user_1 = require("../../models/user");
// const { mongoose } = require('mongoose');
const mongoose_1 = __importDefault(require("mongoose"));
const index_1 = __importDefault(require("../../index"));
describe('/api/genres', () => {
    beforeEach(() => { index_1.default; });
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        // server.close();
        yield genre_1.Genre.remove({});
    }));
    describe('GET /', () => {
        it('should return all genres', () => __awaiter(void 0, void 0, void 0, function* () {
            yield genre_1.Genre.collection.insertMany([
                { name: "genre1" },
                { name: "genre2" }
            ]);
            const res = yield (0, supertest_1.default)(index_1.default).get('/api/genres');
            expect(res.status).toBe(200);
            // expect(res.body.length).toBe(2);
            expect(res.body.some((g) => g.name === 'genre1')).toBeTruthy();
            expect(res.body.some((g) => g.name === 'genre2')).toBeTruthy();
        }));
    });
    describe('Get /:id', () => {
        it('should return a genre if valid id is passed', () => __awaiter(void 0, void 0, void 0, function* () {
            // let genreId = '64198b5b9439559547875244';
            // const res = await request(server).get('/api/genres/' + genreId);
            // expect(res.status).toBe(200);
            // // expect(res.status).toBe(404);
            const genre = new genre_1.Genre({ name: 'Action' });
            yield genre.save();
            const res = yield (0, supertest_1.default)(index_1.default).get('/api/genres/' + genre._id);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', genre.name);
        }));
        it('should return 404 if invalid id is passed', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(index_1.default).get('/api/genres/1');
            expect(res.status).toBe(404);
        }));
        it('should return 404 if no genre with given id exist', () => __awaiter(void 0, void 0, void 0, function* () {
            const id = new mongoose_1.default.Types.ObjectId();
            const res = yield (0, supertest_1.default)(index_1.default).get('/api/genres/' + id);
            expect(res.status).toBe(404);
        }));
    });
    describe('POST /', () => {
        // Define the happy path, and then in each test, we change
        // one parameter that clearly aligns with the name of the
        // test.
        let token;
        let name;
        const exec = () => __awaiter(void 0, void 0, void 0, function* () {
            return yield (0, supertest_1.default)(index_1.default)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({ name }); //IF KEYS AND VALUES ARE SAME, WE CAN USE name ONLY
        });
        beforeEach(() => {
            token = new user_1.User().generateAuthToken();
            name = 'genre1';
        });
        it('should return 401 if client is not logged in', () => __awaiter(void 0, void 0, void 0, function* () {
            token = '';
            const res = yield exec();
            expect(res.status).toBe(401);
        }));
        it('should return 400 if genre is less than 5 characters', () => __awaiter(void 0, void 0, void 0, function* () {
            name = '1234';
            const res = yield exec();
            expect(res.status).toBe(400);
        }));
        it('should return 400 if genre is more than 50 characters', () => __awaiter(void 0, void 0, void 0, function* () {
            name = new Array(52).join('a');
            const res = yield exec();
            expect(res.status).toBe(400);
        }));
        it('should save the genre if it is valid', () => __awaiter(void 0, void 0, void 0, function* () {
            yield exec();
            const genre = yield genre_1.Genre.find({ name: 'genre1' });
            expect(genre).not.toBeNull();
        }));
        it('should return the genre if it is valid', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield exec();
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'genre1');
        }));
    });
    describe('PUT /:id', () => {
        let token;
        let newName;
        let genre;
        let id;
        const exec = () => __awaiter(void 0, void 0, void 0, function* () {
            return yield (0, supertest_1.default)(index_1.default)
                .put('/api/genres/' + id)
                .set('x-auth-token', token)
                .send({ name: newName });
        });
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            // before each test we need to create a genre and
            // put it in the database
            genre = new genre_1.Genre({ name: 'genre1' });
            yield genre.save();
            token = new user_1.User().generateAuthToken();
            id = genre._id;
            newName = 'updatedName';
        }));
        it('should return 401 if client is not logged in', () => __awaiter(void 0, void 0, void 0, function* () {
            token = '';
            const res = yield exec();
            expect(res.status).toBe(401);
        }));
        it('should return 400 if genre is less than 5 characters', () => __awaiter(void 0, void 0, void 0, function* () {
            newName = '1234';
            const res = yield exec();
            expect(res.status).toBe(400);
        }));
        it('should return 400 if genre is more than 50 characters', () => __awaiter(void 0, void 0, void 0, function* () {
            newName = new Array(52).join('a');
            const res = yield exec();
            expect(res.status).toBe(400);
        }));
        it('should return 404 if id is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            id = "63ae81f07b0afa5b0682e07f";
            const res = yield exec();
            expect(res.status).toBe(404);
        }));
        it('should retun 404 if genre with the given id was not found', () => __awaiter(void 0, void 0, void 0, function* () {
            id = new mongoose_1.default.Types.ObjectId();
            const res = yield exec();
            expect(res.status).toBe(404);
        }));
        it('should update the genre if input is valid', () => __awaiter(void 0, void 0, void 0, function* () {
            yield exec();
            const updatedGenre = yield genre_1.Genre.findById(genre._id);
            expect(updatedGenre.name).toBe(newName);
        }));
        it('should return the updated genre if it is valid', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield exec();
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', newName);
        }));
    });
    describe('DELETE /:id', () => {
        let token;
        let genre;
        let id;
        const exec = () => __awaiter(void 0, void 0, void 0, function* () {
            return yield (0, supertest_1.default)(index_1.default)
                .delete('/api/genres/' + id)
                .set('x-auth-token', token)
                .send();
        });
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            // Before each test we need to create a genre and 
            // put it in the database.
            genre = new genre_1.Genre({ name: 'genre1' });
            yield genre.save();
            id = genre._id;
            token = new user_1.User({ isAdmn: true }).generateAuthToken();
        }));
        it('should return 401 if client is not logged in', () => __awaiter(void 0, void 0, void 0, function* () {
            token = '';
            const res = yield exec();
            expect(res.status).toBe(401);
        }));
        it('should return 403 if the user is not an admin', () => __awaiter(void 0, void 0, void 0, function* () {
            token = new user_1.User({ isAdmin: false }).generateAuthToken();
            const res = yield exec();
            expect(res.status).toBe(403);
        }));
        it('should return 404 if id is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            id = 1;
            const res = yield exec();
            expect(res.status).toBe(404);
        }));
        it('should return 404 if no genre with the given id was found', () => __awaiter(void 0, void 0, void 0, function* () {
            id = new mongoose_1.default.Types.ObjectId();
            const res = yield exec();
            expect(res.status).toBe(404);
        }));
        it('should delete the genre if input is valid', () => __awaiter(void 0, void 0, void 0, function* () {
            yield exec();
            const genreInDb = yield genre_1.Genre.findById(id);
            expect(genreInDb).toBeNull();
        }));
        it('should return the removed genre', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield exec();
            expect(res.body).toHaveProperty('_id', genre._id.toHexString());
            expect(res.body).toHaveProperty('name', genre.name);
        }));
    });
});
/*
describe('test HTTP request', () => {
    it('should test HTTP request', async () => {
        const res = await request(server).get('/api/genres2').expect(404); // You can do this way also | https://www.npmjs.com/package/supertest
    });
});
*/ 
