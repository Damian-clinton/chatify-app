import UserModel from "../models/user.js";
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import verifyUser from '../middleware/verifyUser.js';

const router = express.Router()

router.post('/register', async function (req, res) { 
    try{ 
          const {email, password, firstname, lastname} = req.body;
        console.log(req.body)
        const userexist = await UserModel.findOne({email})
        if(userexist) { 
         return res.status(400).json({msg: 'user already exists.'})
        } 
          
        const hashpasscode = await bcrypt.hash(password, 10)
        const newUser = new UserModel({ 
            email, password: hashpasscode, firstname, lastname
        })
    
        await newUser.save()
        return res.status(200).json({msg: "successful"})
        
    } catch(err){ 
         console.log(err)
         return res.status(500).json({msg: "failed to save new user to database"})
    }
});

router.post('/login', async function (req, res) {  
    try{ 
           const {email, password} = req.body
           const logincorrect = await UserModel.findOne({email: req.body.email})
           if(!logincorrect) { 
            return res.status(400).json({msg: 'Invalid login credentials'}) 
           } 

           const comparehash = await bcrypt.compare(password, logincorrect.password)
           if(!comparehash) { 
            return res.status(400).json({msg: 'invalid passcode'})
           }

       const token = jwt.sign({id: logincorrect._id}, process.env.JWT_ACCESS_KEY, {
        expiresIn: '20h' 
       })

       return res.status(200).json({ msg: 'successful', token, user: { id: logincorrect._id, 
         username: logincorrect.username} })
      
    } catch(err){ 
       console.log(err)
       return res.status(500).json({msg: 'error'})
    };
    
}); 

router.get('/verify', verifyUser, async function(req, res) { 
    return res.status(200).json({msg: 'successful'})
});

export default router;