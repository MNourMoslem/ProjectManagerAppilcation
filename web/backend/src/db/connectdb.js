import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

export const connectDB = async () => {
	try {
		console.log("mongo_uri: ", process.env.MONGO_URI);
		console.log("db_name: ", process.env.DB_NAME);
		
		// Add database name from environment variable
		const dbName = process.env.DB_NAME || 'teamwork';
		const uri = process.env.MONGO_URI.endsWith('/') 
			? `${process.env.MONGO_URI}${dbName}`
			: `${process.env.MONGO_URI}/${dbName}`;
			
		console.log("Connecting to MongoDB with URI:", uri);
		const conn = await mongoose.connect(uri);
		console.log(`MongoDB Connected: ${conn.connection.host}`);
		console.log(`Database: ${conn.connection.name}`);
	} catch (error) {
		console.log("Error connection to MongoDB: ", error.message);
		process.exit(1); // 1 is failure, 0 status code is success
	}
};