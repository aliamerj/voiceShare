import  jwt  from 'jsonwebtoken';
import  {auth ,authUpdate } from '../middleware/auth'
import express  from 'express';
import _ from 'lodash'
import bcrypt from 'bcrypt'
import {User , validateUser, userSchema } from '../models/user'
import userX from '../models/user'
import config from 'config';
import admin from '../middleware/admin';

const router = express.Router();

router.get('/', getUsers); // ok
router.get('/:id',getUser ); // ok
router.post('/signup', signup); // ok
router.put('/update/:id',[auth,authUpdate],updateUser); //norm  ~~> but you can't change just one of the element
router.delete('/delete/:id',[auth, admin],deleteUser) // ok






// functions
async function getUsers(req : express.Request , res : express.Response): Promise<void> {
    const user = await User.find().sort('name').select('name').select('username');
    res.send(user);
    
}
async function getUser(req : express.Request , res : express.Response) : Promise<any> {
   try {
    const user = await User.findById(req.params.id);
    res.send(`name : ${user.name} \nusername : ${user.username} `);
       
   } catch (error) {
    res.status(404).send(`user not exist`);
   }
   
    
}

async function signup(req : express.Request , res : express.Response): Promise<any> {
    const {error} = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let email = await User.findOne({email : req.body.email });
    if (email) return res.status(400).send('email already registered ');
    let infoUser = _.pick(req.body, ['name','username', 'email','password']);

    let user = new User(infoUser);
    user.role = 'user' ;
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    try {
        await user.save();
       const token = user.generateAuthToken();
        res.header('x-auth-token', token ).send(`successful signup :)\n\n${_.pick(user, ['name','email'])} `);
    } catch (error : any ) {
        res.status(400).send(error.message);
    }



}

async function updateUser(req : express.Request , res : express.Response): Promise<any>{

    const {error} = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);
try {
        await User.findByIdAndUpdate(req.params.id, {
        name : req.body.name,
        username : req.body.username,
        email : req.body.email,
        password : req.body.password
    }
    );
    res.send('user has been changed ')

    
} catch (error) {
    res.status(404).send(error);
    
}
}

async function deleteUser(req : express.Request , res : express.Response): Promise<any>{
    try {
        await User.findByIdAndRemove(req.params.id);
        res.send('user has been deleted ')

    } catch (error) {
        res.status(404).send(`neither user not exist or already deleted :( `);
    }
    
}

export default router;