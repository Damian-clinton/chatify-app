import express from 'express';
import cors from 'cors'; 
import Authrouter from './routes/auth.js';
import Clientrouter from './routes/client.js'
import connect from './dbconnection.js'
import path from 'path';
import { fileURLToPath } from 'url';
const app = express() 

app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use(express.json())
app.use('/auth', Authrouter)
app.use('/client', Clientrouter)
app.use('/uploads', express.static('uploads')); 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '../chatify/build')));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, '../chatify/build', 'index.html'));
});

app.listen(process.env.PORT || 5011 , () => { 
    connect()
    console.log('server is running')
}); 
