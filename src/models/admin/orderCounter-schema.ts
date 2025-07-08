import mongoose from 'mongoose';
import { IOrderCounter } from '../../types/admin.types.js';

const counterSchema = new mongoose.Schema<IOrderCounter>({
  name: { type: String, required: true, unique: true },
  value: { type: Number, default: 1000 } // starting number
});

export default mongoose.model<IOrderCounter>('Counter', counterSchema); 