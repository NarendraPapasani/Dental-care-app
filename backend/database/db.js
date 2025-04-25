const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      // These options are no longer needed in newer Mongoose versions (6.0+)
      // but are included for compatibility with older versions
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB connection established successfully");

    // Listen for connection errors after initial connection
    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

    // Listen for disconnection
    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB disconnected. Attempting to reconnect...");
    });

    // Listen for reconnection
    mongoose.connection.on("reconnected", () => {
      console.log("MongoDB reconnected successfully");
    });
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    // Exit with failure in critical environments
    process.exit(1);
  }
};

module.exports = connectDB;
