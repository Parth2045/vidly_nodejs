// const {User} = require('../../models/user');
import { User } from '../../models/user';
// const {Genre} = require('../../models/genre');
import { Genre } from '../../models/genre';
// const request = require('supertest');
import request from 'supertest';

import server from '../../index';
// import { describe } from 'joi/lib/types/lazy/index.js';

describe('auth middleware', () => {
    beforeEach(() => { server });
    afterEach(async () => {
        await Genre.remove({});
        server.close();
    });

    let token: string;

    const exec = () => {
        return request(server)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({ name: 'genre1' });
    };

    beforeEach(() => {
        token = new User().generateAuthToken();
    });

    it('should return 401 if no token is provided', async () => {
        token = '';

        const res = await exec();

        expect(res.status).toBe(401);
    });

    it('should return 400 if token is invalid', async () => {
        token = 'a';

        const res = await exec();

        expect(res.status).toBe(400);
    });
    
    it('should return 200 if token is valid', async () => {
        const res = await exec();

        expect(res.status).toBe(200);
    });
});