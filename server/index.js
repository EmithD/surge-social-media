import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
// import csurf from 'csurf';
// import cookieParser from 'cookie-parser';

dotenv.config();

mongoose.connect("mongodb+srv://admin:zOtsESlmD46zvstW@backenddb.wulqw.mongodb.net/Node-API?retryWrites=true&w=majority&appName=BackendDB")
.then(() => {
    console.log(`Conected to the database.`);
}).catch(() => {
    console.log('Connection failed!')
});

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());

app.listen(3000, () => {
    console.log('Server running on 3000');
})

app.get('/', (req, res) => {
    res.json({
        message:"Hello World"
    });
});

