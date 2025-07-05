import { model, Schema,Types } from "mongoose";

const orderSchema = new Schema({
    orderNumber: {
        type: String,
        required: true,
        unique: true
      },
    userId:{
        type:Types.ObjectId,
        ref:'User',
        required:true
    },
    address: {
        type: Schema.Types.ObjectId,
        ref: 'address',
        required: true
    },
    cartItems: [{
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: {
            type: Number,
            required: true
        }
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        enum: ['cod', 'online'],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
    ,
   
}, { timestamps: true });



const OrderSchema = model('Order', orderSchema);
export default OrderSchema;
 