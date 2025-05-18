import jwt from 'jsonwebtoken';
import UserModel from '../models/user.js';

export default async function verifyUser(req, res, next) { 
    try {
        const authHeader = req.header('authorization');
        if (!authHeader) {
            return res.status(401).json({ msg: 'Authorization header missing' });
        }
      
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ msg: 'Token missing' });
        }

        const jwtVerify = jwt.verify(token, process.env.JWT_ACCESS_KEY);
        if (!jwtVerify) { 
            return res.status(401).json({ msg: 'Invalid token' });
        } 

        const user = await UserModel.findOne({ _id: jwtVerify.id }).select('-password'); 
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        req.user = user;
        next();
    } catch (err) { 
        console.error(err);
        return res.status(500).json({ msg: 'Internal server error' });
    }
};
