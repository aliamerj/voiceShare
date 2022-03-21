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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("./../models/user");
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const voice_1 = require("../models/voice");
const config_1 = __importDefault(require("config"));
const router = express_1.default.Router();
router.get('/', getVoices); // ok
router.get('/:id', getVoice); //  ok
router.post('/newVoice', auth_1.auth, postVoice); // ok
router.put('/update/:id', auth_1.auth, auth_1.authUpdate, updateVoice); // use can update his vice
router.delete('/delete/:id', auth_1.auth, deleteVoice); //
// functions
function getVoices(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const voice = yield voice_1.Voice.find().sort({ date: -1 });
        res.send(`name : ${voice}`);
    });
}
function getVoice(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const voice = yield voice_1.Voice.findById(req.params.id);
            const author = yield user_1.User.findById(voice.authorId);
            res.send(`idea : ${voice} \nusername ${author.username}`);
        }
        catch (error) {
            res.status(404).send(`voice not exist`);
        }
    });
}
function postVoice(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { error } = (0, voice_1.validateVoice)(req.body);
        if (error)
            return res.status(400).send(error);
        let voice = new voice_1.Voice({
            authorId: findByToken(res, req),
            idea: req.body.idea
        });
        try {
            const posted = yield voice.save();
            const author = yield user_1.User.findById(posted.authorId);
            res.send(`idea : ${posted.idea} \nusername ${author.username}`);
        }
        catch (error) {
            res.status(400).send('voice did not posted, try again ');
        }
    });
}
function updateVoice(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { error } = (0, voice_1.validateVoice)(req.body);
        if (error)
            return res.status(400).send(error.details[0].message);
        try {
            const change = yield voice_1.Voice.findByIdAndUpdate(req.params.id, {
                idea: req.body.idea
            });
            const newIdea = yield voice_1.Voice.findById(req.params.id);
            res.send(`voice has been changed \n${change.idea} \n to \n${newIdea.idea} `);
        }
        catch (error) {
            res.status(404).send(error);
        }
    });
}
function deleteVoice(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield voice_1.Voice.findByIdAndRemove(req.params.id);
            res.send('voice has been deleted ');
        }
        catch (error) {
            res.status(404).send(`neither voice not exist or already deleted :( `);
        }
    });
}
function findByToken(res, req) {
    const token = req.header('x-auth-token');
    if (!token)
        return res.status(401).send('unauthorized');
    try {
        const decode = jsonwebtoken_1.default.verify(token, config_1.default.get('jwtPrivateKey'));
        return decode;
    }
    catch (e) {
        return res.status(401).send('unauthorized');
    }
}
exports.default = router;
