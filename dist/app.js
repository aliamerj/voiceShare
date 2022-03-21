"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const auth_1 = __importDefault(require("./routes/auth"));
const users_1 = __importDefault(require("./routes/users"));
const voices_1 = __importDefault(require("./routes/voices"));
const config_1 = __importDefault(require("config"));
const app = (0, express_1.default)();
const jwt = config_1.default.get('jwtPrivateKey');
if (!jwt) {
    console.log("FATAL ERROR : JWT not defined");
    process.exit(1);
}
app.use(express_1.default.json());
app.use('/api/users', users_1.default);
app.use('/api/voice', voices_1.default);
app.use('/api/auth', auth_1.default);
mongoose_1.default.connect('mongodb://127.0.0.1/voiceShare')
    .then(() => console.log('connected to mongoDB.. :} '))
    .catch(err => console.error('could not connect to mongoDB...', err));
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
