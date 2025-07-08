import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

// Import routes
import authrouter from './src/routes/users/auth-route.js';
import adminAuthRoute from './src/routes/admin/auth-route.js';
import manageProductRouter from './src/routes/admin/manageProduct-route.js';
import userproductRouter from './src/routes/users/products-route.js';
import orderRoutes from './src/routes/users/order-route.js';
import manageOrdersRoute from './src/routes/admin/manageOrder-route.js';
import userCartRoutes from './src/routes/users/cart-route.js';
import userDetailRouter from './src/routes/users/address-route.js';
import dashboardRoute from './src/routes/admin/dashboard-route.js';

// Define error interface
interface CustomError extends Error {
    status?: number;
}

const app: Express = express();

// CORS configuration
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser middleware
app.use(express.json());

// User routes
app.use('/user', authrouter);
app.use('/user', userproductRouter);
app.use('/user', orderRoutes);
app.use('/user', userCartRoutes);
app.use('/user', userDetailRouter);

// Admin routes
app.use('/admin', adminAuthRoute);
app.use('/admin', manageProductRouter);
app.use('/admin', manageOrdersRoute);
app.use('/admin', dashboardRoute);

// Error handling middleware
app.use((error: CustomError, _req: Request, res: Response, _next: NextFunction): void => {
    res.status(error.status || 500).json({
        message: error.message || "Something went wrong",
        status: error.status || 500
    });
});

export default app; 