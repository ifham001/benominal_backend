import { Request, Response, NextFunction } from 'express';
import adminAuthSchema from "../../models/admin/admin-schema.js";
import HttpError from "../../models/Http-Error.js";
import OrderSchema from "../../models/users/order-schema.js";
import { IOrder } from '../../types/user.types.js';

interface OrderParamsRequest extends Request {
  params: {
    orderId: string;
  };
}

interface UpdateOrderStatusRequest extends OrderParamsRequest {
  body: {
    status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  };
}

// GET: Show all orders to admin with populated address & product details
const showAllOrderToAdminController = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const orders: IOrder[] = await OrderSchema.find().populate("address");
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return next(new HttpError(500, "Failed to fetch orders."));
  }
};

// DELETE: Delete an order by ID
const deleteOrderFromAdminController = async (req: OrderParamsRequest, res: Response, next: NextFunction): Promise<void> => {
  const { orderId } = req.params;
  
  try {
    const deletedOrder: IOrder | null = await OrderSchema.findByIdAndDelete(orderId);
    if (!deletedOrder) {
      return next(new HttpError(404, "Order not found."));
    }

    // Remove the order ID from adminAuthSchema's orders array
    await adminAuthSchema.updateMany(
      { orders: orderId },
      { $pull: { orders: orderId } }
    );

    res.status(200).json({ 
      success: true, 
      message: "Order deleted successfully." 
    });
  } catch (error) {
    console.error("Error deleting order:", error);
    return next(new HttpError(500, "Failed to delete order."));
  }
};

// PATCH: Update order status by ID
const updateOrderStatusController = async (req: UpdateOrderStatusRequest, res: Response, next: NextFunction): Promise<void> => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    const updatedOrder: IOrder | null = await OrderSchema.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    
    if (!updatedOrder) {
      return next(new HttpError(404, "Order not found."));
    }
    
    res.status(200).json({
      success: true,
      message: "Order status updated successfully.",
  
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    return next(new HttpError(500, "Failed to update order status."));
  }
};

export {
  showAllOrderToAdminController,
  deleteOrderFromAdminController,
  updateOrderStatusController,
}; 