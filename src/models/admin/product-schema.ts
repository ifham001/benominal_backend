import { Schema, model } from 'mongoose';
import { IProduct } from '../../types/admin.types.js';

const productSchema = new Schema<IProduct>({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    color: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true
    },
    stocksQuantity: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        enum: ['rings', 'bracelets', 'necklaces', 'earrings'],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    images: [{
        type: String,
        required: true
    }],
});

export default model<IProduct>("product", productSchema); 