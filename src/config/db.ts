import mongoose from "mongoose";

// Database connection configuration
const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error(`Error: ${(err as Error).message}`);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB; 