import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({quiet: true});
mongoose.set('debug', false);


const connectDB = async () => {
    try {
        
        const mongoURI = process.env.MONGO_URI;
        await mongoose.connect(process.env.MONGO_URI, { dbName: 'zentra' });

        console.log('Server: [+] MongoDB Atlas Connected!');
    } catch (error) {
        
        console.error('[!] DB Connection failed -> ', error.message);
        process.exit(1); 
    }
};

export default connectDB;