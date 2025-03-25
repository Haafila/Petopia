import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session';
import { connectDB } from './config/db.js';

import productRoutes from './routes/product.route.js'; 
import orderRoutes from './routes/order.route.js';  
import cartRoutes from './routes/cart.route.js';
//import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
//pet route
//adopt route
//appointment route
import paymentRoutes from './routes/paymentRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
    cors({
      origin: 'http://localhost:5173', 
      credentials: true, 
    })
);

app.use(express.json()); 

app.use(session({
    secret: "secretkeyabc12345", 
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

//app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
//app.use('/api/pet', authRoutes);
//app.use('/api/adopt', authRoutes);
//app.use('/api/appointment', authRoutes);
app.use('/api/payments', paymentRoutes);

app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
});