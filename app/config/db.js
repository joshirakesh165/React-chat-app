import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const url = process.env.MONGO_DB_URL

const createDBConnection = async () => {
    try {
        const conn = await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch(error) {
        console.log(`MongoDB  not Connected: ${url}`);
        process.exit(1);
    }
}

export default createDBConnection;
