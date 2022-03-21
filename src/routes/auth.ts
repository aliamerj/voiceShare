import Joi  from 'joi';
import express  from 'express';
import jwt from 'jsonwebtoken';
import _ from 'lodash'
import bcrypt from 'bcrypt'
import {User} from '../models/user';
import config from 'config'
import userX from '../models/user';

const router = express.Router();


router.post('/login', signup); // -






// functions

async function signup(req : express.Request , res : express.Response): Promise<any> {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let user = await User.findOne({email : req.body.email });
    if (!user) return res.status(400).send('Invalid input');
   const validPassword = await bcrypt.compare(req.body.password, user.password);

   if(!validPassword) return res.status(400).send('Invalid input');

const token = userX;

res.send(token);

}
export function validate(user : express.Request ) : Joi.ValidationResult<any> {
    const schema = Joi.object( {
        email : Joi.string().email().required(),
        password : Joi.string().min(5).max(255).required(),
        

    });
    
    return schema.validate(user);
    
}

export default router;