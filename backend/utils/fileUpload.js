// filepath: c:\Users\papas\New folder\backend\utils\fileUpload.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Create unique filename with original extension
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  // Accept images and PDF files
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/gif" ||
    file.mimetype === "application/pdf"
  ) {
    cb(null, true);
  } else {
    // Reject file
    cb(
      new Error("Only images (JPEG, PNG, GIF) and PDF files are allowed"),
      false
    );
  }
};

// File size limits
const limits = {
  fileSize: 10 * 1024 * 1024, // 10MB max file size
};

// Initialize upload
const upload = multer({
  storage,
  fileFilter,
  limits,
});

module.exports = upload;
