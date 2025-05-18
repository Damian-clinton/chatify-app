import mongoose from 'mongoose'; 
import dotenv from 'dotenv';
dotenv.config();

async function connect () { 
    try {
       await mongoose.connect(process.env.MONGO_URL)
       console.log('connected to mongodb database')
     } 
    catch(err) { 
      console.log(err)
    }
};

export default connect;

