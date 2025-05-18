const io = require("socket.io")(5010, { 
    cors: { 
        origin: 'http://localhost:5001', 
    },
}); 

let users = []
let messages = []
let TypingStatus = []

const addMember = (senderId, socketId) => { 
    const userExist = users.some(user => user.senderId === senderId) 
    if(!userExist) { 
        users.push({senderId, socketId})
    }
}; 

const contentPayload = (conversationId, senderId, context) => { 
    if(conversationId, senderId, context) { 
        messages.unshift({conversationId, senderId, context})
    }
}; 

const uniqueIdentifier = (Id) => { 
    return messages.filter(message => message.conversationId === Id)
}

const disconnectedUsers = (socketId) => { 
   users = users.filter(user=> user.socketId  !== socketId)
};

const getFirstElement = (arr) => {
    return arr[0];
}

const Typing = (sender, conversation) => {
TypingStatus.push({sender, conversation})
 }

 const HideStatus = (sender) => { 
    TypingStatus = TypingStatus.filter(TypingStats => TypingStats.sender !== sender)
 }

io.on('connection', (socket) => { 
    console.log("a user connected.", `${socket.id}`)
     socket.on("addmembers", senderId=> { 
        addMember(senderId, socket.id);
        io.emit('getsenderId', users );
     });

  socket.on('sendtext', ( { conversationId, content: {sender, context}  }) => { 
            contentPayload(conversationId, sender, context);
            const messageBatches = uniqueIdentifier(conversationId)
            const messageBatch= getFirstElement(messageBatches)
            console.log(messageBatch)
            io.emit("getmessage" , messageBatch)
    });

    socket.on("userStatus", ( senderId, conversationID) => { 
         Typing(senderId, conversationID) 
         io.emit('showTyping', TypingStatus)
    })

            socket.on('hideStatus', sender => { 
                HideStatus(sender)
                io.emit('hideTyping', TypingStatus)
            })

 socket.on("disconnect", () => { 
        console.log('User disconnected', `${socket.id}`);
        disconnectedUsers(socket.id)
        io.emit('getsenderId', users );
    })
}); 


module.exports = io;