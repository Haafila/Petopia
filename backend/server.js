import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session';
import { connectDB } from './config/db.js';

import productRoutes from './routes/product.route.js';
import orderRoutes from './routes/order.route.js';
import cartRoutes from './routes/cart.route.js';
import userRoutes from './routes/user.route.js';
import appointmentRoutes from './routes/appointment.route.js';
import timeSlotRoutes from './routes/timeslot.route.js';
import paymentRoutes from './routes/paymentRoutes.js';
import financeRoutes from './routes/financeRoute.js';
import reportRoutes from './routes/report.route.js'; 

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

app.use("/api/users", userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/reports', reportRoutes); 
app.use("/appointments", appointmentRoutes);
app.use('/timeslots', timeSlotRoutes);

app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
});