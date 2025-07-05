import { Router } from "express";
import { makeOrderController, showOrderController } from "../../controllers/users/order-controller.js";
import checkAuth from "../../middleware/checkAuth.js";


const orderRoutes = Router()

orderRoutes.post('/user/order/:userId', checkAuth,makeOrderController)
orderRoutes.get('/user/order/:userId',checkAuth,showOrderController)





export default orderRoutes