import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import productRoute from './routes/product.route.js';
import connectDB from './config/db.js';
import authRoute from './routes/auth.route.js';
import postRoute from './routes/post.route.js'
// import csurf from 'csurf';
// import cookieParser from 'cookie-parser';

const PORT = process.env.PORT || 8080;
dotenv.config();
const app = express();
connectDB();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

//routes
app.use('/api/products', productRoute);

//auth routes
app.use('/api/auth', authRoute);

//post routes
app.use('/api/posts', postRoute)

app.get('/', (req, res) => {
    res.json({
        message:"Hello World"
    });
});

app.listen(PORT, () => {
    console.log('Server running on 8080');
})