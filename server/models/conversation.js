import mongoose from "mongoose"; 
import { Server } from "socket.io";

const PORT = 5011; 
const io = new Server(PORT, {
  cors: {
    origin: "https://chatapp-vk5v.onrender.com",
  },
});

const conversationSchema = new mongoose.Schema( 
    { 
        members: { 
            type: [String], 
            required: true,
        }
    }, {
        timestamps: true 
    }
); 

const conversationModel = mongoose.model('conversation', conversationSchema);
export default conversationModel; 

const changeStream = conversationModel.watch([], { fullDocument: "updateLookup" });

io.on("connection", (socket) => {
    console.log("A client connected:", socket.id);
  });

changeStream.on('change', (change) => {
    if (change.operationType === 'insert') {
      io.emit('conversationInserted', change)
      console.log('A document was inserted:', change);
    }
  });

changeStream.on('error', (error) => {
  if (error.name === 'MongoNetworkError') {
    console.error('Network error with the change stream:', error);
  } else {
    console.error('Change stream error:', error);
  }
});
