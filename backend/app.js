const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./database/db");
const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors()); // Enable CORS

// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const appointmentRoutes = require("./routes/appointment.routes");
const documentRoutes = require("./routes/document.routes");

// Apply routes
app.use("/api/auth", authRoutes); // Authentication routes
app.use("/api/users", userRoutes); // User routes
app.use("/api/appointments", appointmentRoutes); // Appointment routes
app.use("/api/documents", documentRoutes); // Document routes

// Root route
app.get("/", (req, res) => {
  res.send("DentaCare API is running");
});

// 404 - Route not found
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is Listening on port ${PORT}`);
});
