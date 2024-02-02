import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
let isConnected=false;

console.log(process.env.MONGO_URI);

const connectDB = async () => {
    try {
        if(isConnected) return;
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI!}`)
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
        isConnected=true;
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1)
    }
}

export default connectDB