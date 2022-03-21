import mongoose from "mongoose";
import express  from "express";
import Joi from "joi";

export const Voice = mongoose.model('Voice', new mongoose.Schema(
    {
        authorId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User'

        },
        idea : {
            type : String,
            required : true,
            trim : true,
            minlength : 5 ,
            maxlength : 250,

        }
    }
));

export function validateVoice(voice : express.Request ) : Joi.ValidationResult<any>{

    const schema = Joi.object( {
        idea : Joi.string().min(5).max(250).required()
    });
    
    return schema.validate(voice);

}