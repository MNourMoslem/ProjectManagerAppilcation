import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

export const connectDB = async () => {
	try {
		console.log("mongo_uri: ", process.env.MONGO_URI);
		// Add database name explicitly if not already included in URI
		const uri = process.env.MONGO_URI.endsWith('/') 
			? `${process.env.MONGO_URI}teamwork`
			: `${process.env.MONGO_URI}/teamwork`;
		console.log("Connecting to MongoDB with URI:", uri);
		const conn = await mongoose.connect(uri);
		console.log(`MongoDB Connected: ${conn.connection.host}`);
	} catch (error) {
		console.log("Error connection to MongoDB: ", error.message);
		process.exit(1); // 1 is failure, 0 status code is success
	}
};