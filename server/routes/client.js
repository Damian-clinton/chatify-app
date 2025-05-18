import UserModel from "../models/user.js";
import express from 'express';
import verifyUser from '../middleware/verifyUser.js';
import conversationModel from "../models/conversation.js";
import messageModel from "../models/messages.js";
import multer from 'multer';
import path from 'path';
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });


router.get('/search/:firstname', verifyUser, async function (req, res) {
    try { 
        let search = await UserModel.find({ 
            "$or": [ 
                {
                    firstname: { $regex: req.params.firstname, $options: 'i' }
                }
            ]
         })
        
          if(search.length === 0 ) { 
            return res.status(404).json({msg: 'no users found'})
          }; 
        return  res.status(200).json({msg: "successful", search})
    } catch(err) { 
        console.log(err)
    }
});

router.post('/conversations/', verifyUser, async function (req, res) { 
    try { 
        const existingConversation = await conversationModel.findOne({
            members: { $all: [req.body.senderId, req.body.receiverId] }
        });

        if (existingConversation) {
            return res.status(200).json(existingConversation);
        }

        const newConversation = new conversationModel({
            members: [req.body.senderId, req.body.receiverId]
        });

        const savedConversation = await newConversation.save();
        res.status(200).json(savedConversation);

    } catch (error) { 
        console.log(error);
        res.status(500).json({ message: 'Error creating conversation', error });
    }
});


router.get('/conversations/', verifyUser, async (req, res) => {
    const { senderId } = req.query;
    try {
      const conversations = await conversationModel.find({ 
     members: { $in: [senderId] }
      }
      ); 
      res.status(200).json(conversations); 
    } catch (err) {
      res.status(500).json({ message: 'Error fetching users', error: err });
    }
  });

router.get('/getconversationid', verifyUser, async(req, res) => { 
    try{ 
        const result = await conversationModel.findOne( { 
        members: { $all: [req.query.memberId, req.query.senderId] },
         });
        res.json(result)
        } catch(error) { 
            res.status(500).json({ message: 'Internal Server Error' });
        }
     }
     );
              

  router.get('/conversation/', verifyUser, async function (req, res) { 
    try { 
        const { friendId } = req.query;

        const conversations = await UserModel.find({
            _id: { $in: friendId}
        });
        res.status(200).json(conversations);
    } catch (error) { 
        console.error(error);  
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.patch("/update", upload.single("profile"), async (req, res) => {
    try { 
     const {senderId, bio} = req.body;
     const filePath = req.file?.filename;
      const result = await UserModel.updateOne(
         { _id: senderId }, 
          { $set: { photo: filePath, Bio: bio } } 
   );

    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }
  
    res.status(200).json({ message: "Updated successfully" });} 
    catch(error){ 
        res.status(500).json(error)
    }
  });

router.post('/messages/', verifyUser, async function (req, res) {
    const newMessage = new messageModel(req.body)
    try{ 
        const savedMessages = newMessage.save()
        res.status(200).json(savedMessages)
    }catch(error) {
        res.status(500).json(error)
    }
}); 

router.get('/messages/:conversationId', verifyUser, async function (req, res) {
     try{ 
        const messages = await messageModel.find({ 
            conversationID: req.params.conversationId
        });
        res.status(200).json(messages)
     }catch(error) { 
        res.status(500).json(error)
     }
});

router.get('/api/images/', verifyUser, async (req, res) => {
    try {
        const { senderId } = req.query
        console.log('senderid', senderId)
      const images = await UserModel.findOne({ _id: senderId });
      res.json(images); 
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch images' });
    }
  });

export default router;