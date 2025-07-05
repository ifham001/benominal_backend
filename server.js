import dotenv from 'dotenv';

import app from './app.js';
import connectDB from './src/config/db.js';

dotenv.config();

const port = 2027; 

connectDB();

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
