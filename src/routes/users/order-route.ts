import { Router } from "express";
import { makeOrderController, showOrderController } from "../../controllers/users/order-controller.js";

const orderRoutes: Router = Router();

// User order routes
orderRoutes.post('/orders/:userId', makeOrderController);
orderRoutes.get('/orders/:userId', showOrderController);

export default orderRoutes; 