import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import dotenv from "dotenv";

dotenv.config();
const connectDB=async ()=>{
    try {
        // const isConnect=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        const isConnect= await mongoose.connect(process.env.MONGODB_URI, { dbName:DB_NAME });

        if(!isConnect){
            console.log("MongoDB Connection failed");
        }else{
            console.log(`MongoDB Connect Succesfully || at HOST ${mongoose.connection.host}`);
        }
    } catch (error) {
        console.log("MONGO DB connection error", error);
        process.exit(1);
    }
}

export default connectDB;