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
const auth_1 = require("../middleware/auth");
const express_1 = __importDefault(require("express"));
const lodash_1 = __importDefault(require("lodash"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = require("../models/user");
const admin_1 = __importDefault(require("../middleware/admin"));
const router = express_1.default.Router();
router.get('/', getUsers); // ok
router.get('/:id', getUser); // ok
router.post('/signup', signup); // ok
router.put('/update/:id', [auth_1.auth, auth_1.authUpdate], updateUser); //norm  ~~> but you can't change just one of the element
router.delete('/delete/:id', [auth_1.auth, admin_1.default], deleteUser); // ok
// functions
function getUsers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield user_1.User.find().sort('name').select('name').select('username').select('-id');
        res.send(user);
    });
}
function getUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield user_1.User.findById(req.params.id);
            res.send(`name : ${user.name} \nusername : ${user.username} `);
        }
        catch (error) {
            res.status(404).send(`user not exist`);
        }
    });
}
function signup(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { error } = (0, user_1.validateUser)(req.body);
        if (error)
            return res.status(400).send(error.details[0].message);
        let email = yield user_1.User.findOne({ email: req.body.email });
        if (email)
            return res.status(400).send('email already registered ');
        let infoUser = lodash_1.default.pick(req.body, ['name', 'username', 'email', 'password']);
        let user = new user_1.User(infoUser);
        user.role = 'user';
        const salt = yield bcrypt_1.default.genSalt(10);
        user.password = yield bcrypt_1.default.hash(user.password, salt);
        try {
            yield user.save();
            const token = user.generateAuthToken();
            res.header('x-auth-token', token).send(`successful signup :)\n\n${lodash_1.default.pick(user, ['name', 'email'])} `);
        }
        catch (error) {
            res.status(400).send(error.message);
        }
    });
}
function updateUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { error } = (0, user_1.validateUser)(req.body);
        if (error)
            return res.status(400).send(error.details[0].message);
        try {
            yield user_1.User.findByIdAndUpdate(req.params.id, {
                name: req.body.name,
                username: req.body.username,
                email: req.body.email,
                password: req.body.password
            });
            res.send('user has been changed ');
        }
        catch (error) {
            res.status(404).send(error);
        }
    });
}
function deleteUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield user_1.User.findByIdAndRemove(req.params.id);
            res.send('user has been deleted ');
        }
        catch (error) {
            res.status(404).send(`neither user not exist or already deleted :( `);
        }
    });
}
exports.default = router;
