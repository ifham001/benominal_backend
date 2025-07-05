import OrderSchema from '../../models/users/order-schema.js'


import addressSchema from '../../models/users/address-schema.js'
import mongoose from "mongoose";
import productSchema from "../../models/admin/product-schema.js";
import HttpError from "../../models/Http-Error.js";
import authSchema from '../../models/users/auth-schema.js';
import adminAuthSchema from '../../models/admin/admin-schema.js';
import { getNextOrderNumber } from '../../util/getNextOrderNumber.js';


// Utility to get next order number

export const makeOrderController = async (req, res, next) => {
    const { userId } = req.params;
    const { cartItems, totalAmount, paymentMethod, addressId } = req.body;
  
    if (!userId || !cartItems || !totalAmount || !paymentMethod || !addressId) {
      return next(new HttpError(400, "All fields are required"));
    }
  
    const session = await mongoose.startSession();
  
    try {
      session.startTransaction();
  
      const orderNumber = await getNextOrderNumber(session);
  
      const user = await authSchema.findById(userId).session(session);
      if (!user) throw new HttpError(404, "User not found");
  
      const userAddress = await addressSchema.findById(addressId).session(session);
      if (!userAddress) throw new HttpError(404, "Address not found");
  
      // Validate stock & update it
      for (const item of cartItems) {
        const product = await productSchema.findById(item.productId).session(session);
        if (!product) {
          throw new HttpError(404, `Product ${item.productId} not found`);
        }
  
        if (product.stocksQuantity < item.quantity) {
          throw new HttpError(400, `Not enough stock for product ${product.name}`);
        }
  
        product.stocksQuantity -= item.quantity;
        await product.save({ session });
      }
  
      const newOrder = new OrderSchema({
        orderNumber,
        userId,
        address: addressId,
        cartItems,
        totalAmount,
        paymentMethod,
      });
  
      await newOrder.save({ session });
  
      user.allOrder.push(newOrder._id);
      await user.save({ session });

      // Add order ID to admin schema
      const admin = await adminAuthSchema.findOne().session(session);
      if (admin) {
        admin.orders.push(newOrder._id);
        await admin.save({ session });
      }
  
      // 🧹 Clear user's cart
      user.cartItems = [];
      await user.save({ session });
  
      await session.commitTransaction();
      session.endSession();
  
      return res.status(201).json({
        success: true,
        message: "Order placed successfully",
        orderNumber: newOrder.orderNumber,
      });
  
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error("Order creation error:", error);
      return next(
        error instanceof HttpError
          ? error
          : new HttpError(500, "Something went wrong while placing the order")
      );
    }
  };
  
export const showOrderController = async (req, res, next) => {
  const { userId } = req.params;

  if (!userId) {
    return next(new HttpError(400, "User ID is required"));
  }

  try {
    const orders = await OrderSchema.find({ userId })
   
 
    if (!orders.length) {
      return next(new HttpError(404, "No orders found for this user"));
    }

    res.status(200).json({ orders });
  } catch (error) {
    console.error(error);
    return next(new HttpError(500, "Failed to retrieve orders"));
  }
};
