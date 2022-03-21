"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const joi_1 = __importDefault(require("joi"));
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = require("../models/user");
const user_2 = __importDefault(require("../models/user"));
const router = express_1.default.Router();
router.post('/login', signup); // -
// functions
function signup(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { error } = validate(req.body);
        if (error)
            return res.status(400).send(error.details[0].message);
        let user = yield user_1.User.findOne({ email: req.body.email });
        if (!user)
            return res.status(400).send('Invalid input');
        const validPassword = yield bcrypt_1.default.compare(req.body.password, user.password);
        if (!validPassword)
            return res.status(400).send('Invalid input');
        const token = user_2.default;
        res.send(token);
    });
}
function validate(user) {
    const schema = joi_1.default.object({
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().min(5).max(255).required(),
    });
    return schema.validate(user);
}
exports.validate = validate;
exports.default = router;
