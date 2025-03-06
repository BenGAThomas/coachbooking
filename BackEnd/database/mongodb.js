import mongoose from "mongoose";
import { MongoDB_URI, NODE_ENV } from "../config/env.js";

if(!MongoDB_URI) {
    throw new Error('Please define MongoDB_URI environment variable inside .env.<development/production>.local')
}

const connectToDatabase = async () => {
    try {
        await mongoose.connect(MongoDB_URI)

        console.log(`Connected to database in ${NODE_ENV} mode`)
    } catch (error) {
        console.log('Error connecting to database: ', error)
    }
}

export default connectToDatabase