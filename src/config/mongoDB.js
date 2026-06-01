import mongoose from "mongoose";

/* export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  try {
    await mongoose.connect(uri, { dbName: "group5_ecommerce" });
    console.log(`MongoDB Connected 🟢`);
  } catch (error) {
    console.error(`MongoDB Connection Failed 🔴`);
    throw error;
  }
} */

// Use this code to solve 1st time connect error (Connection reset by peer-ECONNRESET)
export const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      throw new Error("MONGODB_URI is undifined!");
    }

    //Connection parameter to prevent ECONNRESET
    const connectionOPtions = {
      dbName: "group5_ecommerce",
      socketTimeoutMS: 45000,
    };

    await mongoose.connect(uri, connectionOPtions);
    console.log(`MongoDB Connected 🟢`);
  } catch (error) {
    console.error(`MongoDB Connection Failed 🔴`, error.message);
    process.exit(1);
  }
};
