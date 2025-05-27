import mongoose from "mongoose";

const connectDatabase = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/job-portal`),
      console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1); // Exit process with failure
  }
};

export default connectDatabase;
