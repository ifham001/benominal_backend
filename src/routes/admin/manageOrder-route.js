import { Router } from "express";
import checkAuth from "../../middleware/checkAuth.js";
import { deleteOrderFromAdminController, showAllOrderToAdminController, updateOrderStatusController } from "../../controllers/admin/manageOrder-controller.js";



const manageOrdersRoute = Router()

manageOrdersRoute.get('/all-orders',checkAuth,showAllOrderToAdminController)
manageOrdersRoute.get('/delete-order/:orderId',checkAuth,deleteOrderFromAdminController)
manageOrdersRoute.patch('/order/status-update/:orderId',checkAuth,updateOrderStatusController)








export default manageOrdersRoute




