"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUser = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const joi_1 = __importDefault(require("joi"));
const User = mongoose_1.default.model('User', new mongoose_1.default.Schema({
    name: {
        type: String,
        minlength: 5,
        maxlength: 20,
    },
    username: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 20,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validator_1.default.isEmail, 'invalid email'],
    },
    password: {
        type: String,
        required: true,
        validator: [validator_1.default.isStrongPassword, 'week password , try agin']
    },
    role: {
        type: String,
        default: 'visitor'
    }
}));
function validateUser(user) {
    const schema = joi_1.default.object({
        name: joi_1.default.string().min(5).max(20).required(),
        userName: joi_1.default.string().min(5).max(20).required(),
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().min(5).max(255).required(),
    });
    return schema.validate(user);
}
exports.validateUser = validateUser;
