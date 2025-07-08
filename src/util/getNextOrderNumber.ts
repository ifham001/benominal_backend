import Counter from '../models/admin/orderCounter-schema.js';
import { ClientSession } from 'mongoose';
import { IOrderCounter } from '../types/admin.types.js';

export const getNextOrderNumber = async (session: ClientSession): Promise<string> => {
  const counter: IOrderCounter = await Counter.findOneAndUpdate(
    { name: 'order' },
    { $inc: { value: 1 } },
    { new: true, upsert: true, session }
  );

  // Format: BNMLJY-1001
  return `BNMLJY-${counter.value}`;
}; 