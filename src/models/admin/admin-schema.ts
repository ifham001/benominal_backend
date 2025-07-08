import mongoose, { Schema } from "mongoose";
import { IAdmin } from '../../types/admin.types.js';

const adminSchema = new Schema<IAdmin>({
    name: {
        type: String,
        required: true,
        trim: true
    },
    orders: [{
        type: Schema.Types.ObjectId,
        ref: 'Order'
    }],
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }],
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

export default mongoose.model<IAdmin>('Admin', adminSchema); 