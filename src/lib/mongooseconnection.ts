import mongoose from "mongoose";

const MONGO_URI = process.env.MONGODB_URI;

console.log(MONGO_URI)

if (!MONGO_URI) {
  throw new Error("❌ MongoDB URI is missing in environment variables!");
}

let isConnected = false; 

export const mongooseConnection = async () => {
  if (isConnected) {
    console.log("⚡ Using existing MongoDB connection");
    return;
  }

  try {
    const db = await mongoose.connect(MONGO_URI, {});
    isConnected = true;
    console.log(`✅ MongoDB Connected: ${db.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1); 
  }
};
