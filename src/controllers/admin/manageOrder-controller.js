

import adminAuthSchema from "../../models/admin/admin-schema.js";
import HttpError from "../../models/Http-Error.js";
import OrderSchema from "../../models/users/order-schema.js";


// GET: Show all orders to admin with populated address & product details
const showAllOrderToAdminController = async (req, res, next) => {
  try {
    const orders = await OrderSchema.find().populate("address")
    res.status(200).json( orders );
  } catch (error) {
    console.error("Error fetching orders:", error);
    return next(new HttpError(500, "Failed to fetch orders."));
  }
};

// DELETE: Delete an order by ID
const deleteOrderFromAdminController = async (req, res, next) => {
  const { orderId } = req.params;
  try {
    const deletedOrder = await OrderSchema.findByIdAndDelete(orderId);
    if (!deletedOrder) {
      return next(new HttpError(404, "Order not found."));
    }

    // Remove the order ID from adminAuthSchema's orders array
    await adminAuthSchema.updateMany(
      { orders: orderId },
      { $pull: { orders: orderId } }
    );

    res
      .status(200)
      .json({ success: true, message: "Order deleted successfully." });
  } catch (error) {
    console.error("Error deleting order:", error);
    return next(new HttpError(500, "Failed to delete order."));
  }
};

// PATCH: Update order status by ID
const updateOrderStatusController = async (req, res, next) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    const updatedOrder = await OrderSchema.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    if (!updatedOrder) {
      return next(new HttpError(404, "Order not found."));
    }
    res.status(200).json(updatedOrder);
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
