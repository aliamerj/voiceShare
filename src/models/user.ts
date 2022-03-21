import mongoose from "mongoose";
import validator from 'validator';
import express  from "express";
import Joi from "joi";
import config from "config";
import  jwt  from 'jsonwebtoken';

export const userSchema = new mongoose.Schema(
    {
        name : {
            type : String,
            minlength : 5,
            maxlength : 20,

        },
        username : {
            type : String,
            required : true,
            index:true,
            unique:true,
            sparse:true,    
            minlength : 5,
            maxlength : 20,
        },
        email :  {
            type : String,
            required : true,
            index:true,
            unique:true,
            sparse:true,  
            minlength : 5,
            maxlength : 20,
            validate : [ validator.isEmail, 'invalid email' ],
        },
        password : {
            type : String,
            required : true,
            validator : [validator.isStrongPassword, 'week password , try agin']

        },
        role : {
            type : String,
            default : 'visitor'

        }
    }
);
 export default userSchema.methods.generateAuthToken = function(): string{
    const token =jwt.sign( {_id : this._id}, config.get('jwtPrivateKey'));

    return token;

}
export function validateUser(user : express.Request ) : Joi.ValidationResult<any> {
    const schema = Joi.object( {
        name : Joi.string().min(5).max(20).required(),
        username : Joi.string().min(5).max(20).required(),
        email : Joi.string().email().required(),
        password : Joi.string().min(5).max(255).required(),
        

    });
    
    return schema.validate(user);
    
}
export const User = mongoose.model('User',userSchema)

module.exports.models = {
    connection: 'mongodb',
    migrate: 'safe'
  }
