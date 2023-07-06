import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import _ from 'lodash';
import { User, UserValidator } from '../models/user';

interface AuthenticatedRequest extends Request {
    user: {
        _id: string;
    };
};

const getCurrentUser = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    const user = await User.findById(req.user._id).select('-password').lean();
    console.log("USER: ", req.user, req.user._id, user);
    res.send(user);
};

const createUser = async (req: Request, res: Response): Promise<any> => {
    const { error } = UserValidator.validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);
  
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already registered.');
  
    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
  
    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
};

export { getCurrentUser, createUser };