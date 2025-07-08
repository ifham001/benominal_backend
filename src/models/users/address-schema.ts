import { model, Schema } from "mongoose";
import { IAddress } from '../../types/user.types.js';

const AddressSchema = new Schema<IAddress>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: false
    },
    city: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    apartment: {
        type: String,
        required: false
    },
}, { timestamps: true });

export default model<IAddress>('address', AddressSchema); 