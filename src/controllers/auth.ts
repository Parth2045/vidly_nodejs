import { Request, Response } from 'express';
import Joi from 'joi';
import bcrypt from 'bcrypt';
import * as _ from 'lodash';
import { User } from '../models/user';

const auth = async ( req: Request, res: Response ): Promise<any> => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email }).lean();
    if (!user) return res.status(400).send('Invalid email or password.');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid email or password.');

    const userModelObj = new User(user);
    const token = userModelObj.generateAuthToken();
    
    res.send(token); 
}

function validate(req: any) {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    });

    return Joi.validate(req, schema);
}

/**
 * NOTE :  //IF SINGLE FUNCTION EXPORTED THEN USE "export default FNNAME".
 */
export default auth;