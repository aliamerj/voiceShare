import express from "express";
import mongoose from "mongoose";
import auth from "./routes/auth";
import users from "./routes/users"
import voices from "./routes/voices"
import config from "config"

const app = express();
const jwt =config.get('jwtPrivateKey')
if (!jwt) 
{
 console.log("FATAL ERROR : JWT not defined");
 process.exit(1);
}
app.use(express.json())
app.use('/api/users', users);
app.use('/api/voice',voices);
app.use('/api/auth', auth);
mongoose.connect('mongodb://127.0.0.1/voiceShare')
        .then(()=> console.log('connected to mongoDB.. :} '))
        .catch(err => console.error('could not connect to mongoDB...', err));



const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
