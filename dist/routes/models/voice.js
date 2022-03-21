"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateVoice = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const joi_1 = __importDefault(require("joi"));
const Voice = mongoose_1.default.model('Voice', new mongoose_1.default.Schema({
    idea: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 250,
    }
}));
function validateVoice(voice) {
    const schema = joi_1.default.object({
        idea: joi_1.default.string().min(5).max(250).required(),
    });
    return schema.validate(voice);
}
exports.validateVoice = validateVoice;
