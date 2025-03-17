import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

//import productRoutes from './routes/product.route.js'; 
//import orderRoutes from './routes/order.route.js';  
import authRouter from './routes/auth.route.js';
import userRouter from './routes/user.route.js';
import petRouter from './routes/pet.route.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); 

app.use(cors({
    origin: ['http://localhost:5173'], // adjust if using a different frontend port
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization']
}));
  
// Serve uploaded images
app.use('/public/uploads', express.static('server/public/uploads'));
  
// Routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/pet', petRouter);
app.use('/public/uploads', express.static('public/uploads'));
  
//app.use('/api/products', productRoutes);
//app.use('/api/orders', orderRoutes);

app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
});