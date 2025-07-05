import mongoose from "mongoose";

 // db.js


const connectDB = async () => {
  try {
   await mongoose.connect(process.env.MONGODB_URI);
  
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1); // Exit process with failure
  }
};

 export default connectDB;
