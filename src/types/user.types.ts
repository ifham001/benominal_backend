import { Document, Types } from 'mongoose';

export interface ICartItem {
  _id?: Types.ObjectId;
  productId: Types.ObjectId;
  quantity: number;
  image: string;
  price: number;
  title: string;
  toObject?: () => any;
}

export interface IUser extends Document {
  username: string;
  email?: string;
  phone?: string;
  allOrder: Types.ObjectId[];
  createdAt: Date;
  wishlist: Types.ObjectId[];
  cartItems: ICartItem[];
  address: Types.ObjectId[];
  authProvider: 'phone' | 'google';
}

export interface IOrderItem {
  productId: Types.ObjectId;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  orderNumber: string;
  userId: Types.ObjectId;
  address: Types.ObjectId;
  cartItems: IOrderItem[];
  totalAmount: number;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'cod' | 'online';
  createdAt: Date;
  updatedAt: Date;
}

export interface IAddress extends Document {
  user: Types.ObjectId;
  firstName: string;
  lastName?: string;
  city: string;
  phone: string;
  pincode: string;
  email: string;
  address: string;
  apartment?: string;
  createdAt: Date;
  updatedAt: Date;
} 