// const {User} = require('../../../models/user');
import { User } from '../../../models/user.js';
// const jwt = require('jsonwebtoken');
import jwt from 'jsonwebtoken';
// const config = require('config');
import config from 'config';
// const mongoose = require('mongoose');
import mongoose from 'mongoose';

describe('user.generateAuthToken', () => {
    it('should return a valid JWT', () => {
        const payload = {
            _id: new mongoose.Types.ObjectId().toHexString(),
            isAdmin: true
        };
        const user = new User(payload);
        const token = user.generateAuthToken();
        const decode = jwt.verify(token, config.get('jwtPrivateKey'));
        expect(decode).toMatchObject(payload);
    });
});
