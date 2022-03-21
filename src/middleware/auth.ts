import { Voice } from './../models/voice';
import  jwt from 'jsonwebtoken';
import express  from 'express';
import config from 'config'

export function auth(req : any, res : any, next : any){
   const token : any = req.header('x-auth-token');
   if (!token) return res.status(401).send('no token');
   try {
    const decode = jwt.verify(token, config.get('jwtPrivateKey'));
    req.user = decode;
    next();

   } catch (error) {
       res.status(400).send('invalid token');
   }
}

export async function authUpdate(req : express.Request, res : any, next : any){
    const token : any = req.header('x-auth-token');
    try {
        const decode : any = jwt.verify(token, config.get('jwtPrivateKey'));
        const userId : any = await Voice.findById(req.params.id)

       const verify = decode._id.localeCompare(userId.authorId._id);
       if (verify == 0) next();
        
    } catch (e) {
        res.status(400).send('you can not update or delete this voice ');
    }
    
}
export async function authAdmin(req : express.Request, res : any, next : any){
    const token : any = req.header('x-auth-token');
    try {
        const decode : any = jwt.verify(token, config.get('jwtPrivateKey'));
        const userId : any = await Voice.findById(req.params.id)

       const verify = decode._id.localeCompare(userId.authorId._id);
       if (verify == 0) next();
        
    } catch (e) {
        res.status(400).send('you can not update ');
    }
    
}


export default module ;