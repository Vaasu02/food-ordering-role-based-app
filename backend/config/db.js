// backend/config/db.js

const mongoose = require('mongoose');

// Function to establish database connection
const connectDB = async () => {
  try {
    // 1. Get the MongoDB Connection String from environment variables
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      console.error("FATAL ERROR: MONGO_URI is not defined in the environment variables.");
      // Exit the process if the connection string is missing
      process.exit(1);
    }

    // 2. Connect to MongoDB using Mongoose
    const conn = await mongoose.connect(mongoUri);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;