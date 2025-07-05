import { model, Schema } from "mongoose";

// firstName: '',
// lastName: '',
// email: '',
// phone: '',
// address: '',
// apartment: '',
// city: '',
// pincode: '',
// countryCode: '+91',
const AddressSchema = new Schema({
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
const UserAddressSchema = model('address', AddressSchema);
export default UserAddressSchema;