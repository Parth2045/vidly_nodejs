import { User } from '../../models/user';
import auth from '../../middleware/auth';
import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';

import { jest } from '@jest/globals';

interface AuthenticatedRequest extends Request {
  user?: any; // Replace `any` with the actual type of `user` if available
}

describe('auth middleware', () => {
  it('should populate req.user with the payload of a valid JWT', () => {
    const user = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      isAdmin: false,
    };
    const token = new User(user).generateAuthToken();
    const req: AuthenticatedRequest = {
      header: jest.fn().mockReturnValue(token),
    } as unknown as Request;
    const res: Response = {} as Response;
    const next: NextFunction = jest.fn();

    auth(req, res, next);

    expect(req.user).toMatchObject(user);
  });
});
