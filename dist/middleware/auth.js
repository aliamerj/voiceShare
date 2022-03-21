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
exports.authAdmin = exports.authUpdate = exports.auth = void 0;
const voice_1 = require("./../models/voice");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("config"));
function auth(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token)
        return res.status(401).send('no token');
    try {
        const decode = jsonwebtoken_1.default.verify(token, config_1.default.get('jwtPrivateKey'));
        req.user = decode;
        next();
    }
    catch (error) {
        res.status(400).send('invalid token');
    }
}
exports.auth = auth;
function authUpdate(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = req.header('x-auth-token');
        try {
            const decode = jsonwebtoken_1.default.verify(token, config_1.default.get('jwtPrivateKey'));
            const userId = yield voice_1.Voice.findById(req.params.id);
            const verify = decode._id.localeCompare(userId.authorId._id);
            if (verify == 0)
                next();
        }
        catch (e) {
            res.status(400).send('you can not update or delete this voice ');
        }
    });
}
exports.authUpdate = authUpdate;
function authAdmin(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = req.header('x-auth-token');
        try {
            const decode = jsonwebtoken_1.default.verify(token, config_1.default.get('jwtPrivateKey'));
            const userId = yield voice_1.Voice.findById(req.params.id);
            const verify = decode._id.localeCompare(userId.authorId._id);
            if (verify == 0)
                next();
        }
        catch (e) {
            res.status(400).send('you can not update ');
        }
    });
}
exports.authAdmin = authAdmin;
exports.default = module;
