import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({ 
    conversationID : { 
        type: String
    },
    sender: { 
        type: String
    },
    context: { 
        type: String
    }
});

const messageModel = mongoose.model('message', messageSchema)
export default messageModel;