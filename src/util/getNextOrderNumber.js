import Counter from '../models/admin/orderCounter-schema.js';
// utils/getNextOrderNumber.js


export const getNextOrderNumber = async (session) => {
  const counter = await Counter.findOneAndUpdate(
    { name: 'order' },
    { $inc: { value: 1 } },
    { new: true, upsert: true, session }
  );

  // Format: ORD-1001
  return `BNMLJY-${counter.value}`;
};
