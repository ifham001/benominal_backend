import mongoose, { Schema } from "mongoose";


const adminSchema = new Schema({
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

const adminAuthSchema = mongoose.model('Admin', adminSchema);
export default adminAuthSchema;