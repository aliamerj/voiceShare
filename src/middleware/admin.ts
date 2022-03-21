import { User } from './../models/user';
import { Voice } from './../models/voice';
import  jwt from 'jsonwebtoken';
import express  from 'express';
import config from 'config'

export default async function admin(req : express.Request, res : express.Response, next : any){
   const token : any = req.header('x-auth-token');
   const decode : any = jwt.verify(token, config.get('jwtPrivateKey'));
   const getUser : any = await User.findById(decode._id)
   if (getUser.role != "admin") return res.status(403).send('Access denied.');
   next();
   
}