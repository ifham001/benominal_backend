import { Schema ,model } from 'mongoose'

const product = new Schema({
    title:{
        type:String,
        required:true,
        unique:true, 
    
    },
    color:{
        type:String,
        required:true,
        trim:true,
    },
    description:{
        type:String,
        required:true,
        trim:true,
    },
    price:{
        type:Number,
        required:true
    },
   stocksQuantity:{
        type:Number,
        required:true
    },
    category:{
        type:'String',
        enum:['rings','bracelets','necklaces','earrings'],
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
 
    images:[{
        type:String,
        required:true
    }],

})
const productSchema = model("product", product);
export default  productSchema;
