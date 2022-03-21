import jwt  from 'jsonwebtoken';
import { User } from './../models/user';
import express from 'express';
import {auth, authUpdate} from '../middleware/auth';
import {Voice , validateVoice } from '../models/voice'
import config from 'config';

const router = express.Router();

router.get('/', getVoices); // ok
router.get('/:id',getVoice ); //  ok
router.post('/newVoice',[auth],postVoice); // ok
router.put('/update/:id', [auth,authUpdate],updateVoice); // ok
router.delete('/delete/:id', [auth,authUpdate], deleteVoice) // ok


// functions
async function getVoices(req : express.Request , res : express.Response): Promise<void> {
    const voice = await Voice.find().sort({date : -1});
    res.send(`name : ${voice}`);
    
}
async function getVoice(req : express.Request , res : express.Response) : Promise<any> {
   try {
    const voice = await Voice.findById(req.params.id);
    const author = await User.findById(voice.authorId);
    res.send(`idea : ${voice} \nusername ${author.username}`);
       
   } catch (error) {
    res.status(404).send(`voice not exist`);
   }
   
    
}

async function postVoice(req : express.Request , res : express.Response): Promise<any> {
   
    const {error} = validateVoice(req.body);
    if (error) return res.status(400).send(error);

    let voice = new Voice(
        {
           authorId : findByToken(res,req),
           idea : req.body.idea
        }
    );
    try {
      const posted =  await voice.save();
      const author = await User.findById(posted.authorId);
        res.send(`idea : ${posted.idea} \nusername ${author.username}`);
        
    } catch (error) {
        res.status(400).send('voice did not posted, try again ');
    }

}

async function updateVoice(req : express.Request , res : express.Response): Promise<any>{

    const {error} = validateVoice(req.body);
    if (error) return res.status(400).send(error.details[0].message);
try {
      const change =  await Voice.findByIdAndUpdate(req.params.id, {
        idea : req.body.idea
    }
    );
    const newIdea = await Voice.findById(req.params.id)
    res.send(`voice has been changed \n${change.idea} \n to \n${newIdea.idea} `);

    
} catch (error) {
    res.status(404).send(error);
    
}
}

async function deleteVoice(req : express.Request , res : express.Response): Promise<any>{
    try {
        await Voice.findByIdAndRemove(req.params.id);
        res.send('voice has been deleted ')

    } catch (error) {
        res.status(404).send(`neither voice not exist or already deleted :( `);
    }
    
}
function findByToken(res : express.Response , req :express.Request) {
    const token : any = req.header('x-auth-token');
    if(!token) return res.status(401).send('unauthorized');
    try {
        const decode = jwt.verify(token, config.get('jwtPrivateKey'));
        return decode;
    } catch (e) {
        return res.status(401).send('unauthorized');
    }
}

export default router;

