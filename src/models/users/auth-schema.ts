import { model, Schema } from 'mongoose';
import crypto from 'crypto';
import { IUser } from '../../types/user.types.js';

const authSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    unique: true,
    sparse: true,
  },

  phone: {
    type: String,
    unique: true,
    sparse: true,
  },
  
  allOrder: [{
    type: Schema.Types.ObjectId,
    ref: 'Order',
  }],

  createdAt: {
    type: Date,
    default: Date.now,
  },

  wishlist: [{
    type: Schema.Types.ObjectId,
    ref: 'Product',
  }],

  cartItems: [{
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  }],

  address: [{
    type: Schema.Types.ObjectId,
    ref: 'address',
  }],

  authProvider: {
    type: String,
    enum: ['phone', 'google'],
    required: true,
  },
});

// Pre-validation logic to assign fallback values
authSchema.pre<IUser>('validate', function (next) {
  // Normalize null values to avoid dup index errors
  if (this.email === null) this.email = undefined;
  if (this.phone === null) this.phone = undefined;

  // If signed up via phone, fill fake email
  if (this.authProvider === 'phone' && !this.email) {
    this.email = `phoneuser_${crypto.randomBytes(5).toString('hex')}@example.com`;
  }

  // If signed up via google/email, fill fake phone
  if (this.authProvider === 'google' && !this.phone) {
    this.phone = `+9${Math.floor(1000000000 + Math.random() * 9000000000)}`; // pseudo-random 10-digit number
  }

  next();
});

export default model<IUser>('User', authSchema); 