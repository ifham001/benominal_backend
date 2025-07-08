import { Document, Types } from 'mongoose';

export interface IProduct extends Document {
  title: string;
  color: string;
  description: string;
  price: number;
  stocksQuantity: number;
  category: 'rings' | 'bracelets' | 'necklaces' | 'earrings';
  createdAt: Date;
  images: string[];
}

export interface IAdmin extends Document {
  name: string;
  orders: Types.ObjectId[];
  users: Types.ObjectId[];
  products: Types.ObjectId[];
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderCounter extends Document {
  name: string;
  value: number;
} 