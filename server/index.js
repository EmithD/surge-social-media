import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import Product from './models/product.model.js';
import productRoute from './routes/product.route.js';
// import csurf from 'csurf';
// import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

//routes
app.use('/api/products', productRoute);


app.get('/', (req, res) => {
    res.json({
        message:"Hello World"
    });
});

mongoose.connect("mongodb+srv://admin:zOtsESlmD46zvstW@backenddb.wulqw.mongodb.net/Node-API?retryWrites=true&w=majority&appName=BackendDB")
.then(() => {
    console.log(`Conected to the database.`);
}).catch(() => {
    console.log('Connection failed!')
});

app.listen(3000, () => {
    console.log('Server running on 3000');
})


