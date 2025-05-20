import mongoose from 'mongoose' 

const UserSchema = new mongoose.Schema({ 
    firstname: {
        type: String, 
        required: true
    },
    lastname: {
        type: String, 
        required:true
    },
    password: { 
        type: String,
        required: true, 
        unique: true,
    }, 
    email: { 
        type: String,
        required: true,
        unique: true,
    }, 
    photo: { 
        type: String,
        required: false,
    },
    Bio: { 
        type: String,
        required: false,
    }
});

const UserModel = mongoose.model('User', UserSchema)
export default UserModel; 

