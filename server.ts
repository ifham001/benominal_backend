import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './src/config/db.js';

dotenv.config();

const port: number = 2029;

// Connect to database
connectDB();

// Start server
app.listen(port, (): void => {
    console.log(`Server is running on port ${port}`);
});

export default app; 