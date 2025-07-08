import { Router } from "express";
import { 
  showAllOrderToAdminController, 
  deleteOrderFromAdminController, 
  updateOrderStatusController 
} from "../../controllers/admin/manageOrder-controller.js";

const manageOrdersRoute: Router = Router();

// Admin order management routes
manageOrdersRoute.get('/all-orders', showAllOrderToAdminController);
manageOrdersRoute.delete('/delete-order/:orderId', deleteOrderFromAdminController);
manageOrdersRoute.post('/orders/status-update/:orderId', updateOrderStatusController);

export default manageOrdersRoute; 