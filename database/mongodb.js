import mongoose from "mongoose";
import { DB_URI, NODE_ENV } from "../config/env.js";

if (!DB_URI) {
    throw new Error(
        "Please define MONGODB_URI in .env.<development/production>.local"
    );
}

const connectToDatabase = async () => {
    try {
        await mongoose.connect(DB_URI);

        console.log(`connectd to database in ${NODE_ENV} mode`);
    } catch {
        console.error("Error: error connecting database");
        process.exit(1);
    }
};

export default connectToDatabase;
