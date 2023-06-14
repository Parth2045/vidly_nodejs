// const {User} = require('../../models/user');
import { User } from '../../models/user.js';
// const auth = require('../../middleware/auth');
import auth from '../../middleware/auth.js';
// const mongoose = require('mongoose');
import mongoose from 'mongoose';

import { jest } from '@jest/globals';

describe('auth middleware', () => {
    it('should populate req.user with the payload of a valid JWT', () => {
        const user = { 
            _id: mongoose.Types.ObjectId().toHexString(),
            isAdmin: false
        };
        const token = new User(user).generateAuthToken();
        console.log(token);
        const req = {
            header: jest.fn().mockReturnValue(token)
        };
        const res = {};
        const next = jest.fn();

        auth(req, res, next);

        expect(req.user).toMatchObject(user);
    });
});