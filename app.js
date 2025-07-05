import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

// import ImgsUpload from './src/routes/admin/uploadImgs.js'
// import productRouter from './src/routes/admin/product.js';
// import adminAuthRoute from './src/routes/admin/adminAuth.js';

// import userproductRouter from './src/routes/user/product-route.js';
// import userDetailRouter from './src/routes/user/userDetail-route.js';
// import userCartRoutes from './src/routes/user/cart-route.js';
// import orderRoutes from './src/routes/user/order-route.js';
// import AdminordersRouter from './src/routes/admin/order.js';
import authrouter from './src/routes/users/auth-route.js';
import adminAuthRoute from './src/routes/admin/auth-route.js';
import manageProductRouter from './src/routes/admin/manageProduct-route.js';
import userproductRouter from './src/routes/users/products-route.js';
import orderRoutes from './src/routes/users/order-route.js';
import manageOrdersRoute from './src/routes/admin/manageOrder-route.js';
import userCartRoutes from './src/routes/users/cart-route.js';
import userDetailRouter from './src/routes/users/address-route.js';
import dashboardRoute from './src/routes/admin/dashboard-route.js';



const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// app.use((req, res, next) => {
//     res.removeHeader('Cross-Origin-Opener-Policy');
//     res.removeHeader('Cross-Origin-Embedder-Policy');
//     next();
//   });

// user routes -------------
app.use('/user', authrouter);
app.use('/user', userproductRouter);
app.use('/user', orderRoutes);
app.use('/user', userCartRoutes);
app.use('/user', userDetailRouter);






// Admin routes -------------
app.use('/admin', adminAuthRoute);
app.use('/admin', manageProductRouter);
app.use('/admin', manageOrdersRoute);
app.use('/admin', dashboardRoute);

// app.use('/', ImgsUpload);
// app.use('/', productRouter);
// app.use('/', adminAuthRoute);
// app.use('/user', authrouter);
// app.use('/',userproductRouter)
// app.use('/',userDetailRouter)
// app.use('/',userCartRoutes)
// app.use('/',orderRoutes)
// app.use('/',AdminordersRouter)
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.get('/', (req, res) => {
//     res.send('Hello World!');
// });

// app.use('/', adminRouter);
// app.use('/', categoryRouter);
// app.use('/', authRouter);
// app.use('/', productRouter);

// // Error handling middleware
app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        message: error.message || "Something went wrong",
        status: error.status || 500
    });
});

export default app;
