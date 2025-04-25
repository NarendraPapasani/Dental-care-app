// filepath: c:\Users\papas\New folder\backend\routes\document.routes.js
const router = require("express").Router();
const {
  uploadDocument,
  getPatientDocuments,
  getDentistDocuments,
  getAppointmentDocuments,
  downloadDocument,
  deleteDocument,
} = require("../controllers/document.controllers");
const {
  authMiddleware,
  authorizeRoles,
} = require("../middleware/auth.middleware");
const upload = require("../utils/fileUpload");

// Upload document route (dentists only)
router.post(
  "/upload",
  authMiddleware,
  authorizeRoles(["doctor"]),
  upload.single("document"),
  uploadDocument
);

// Get patient documents
router.get(
  "/patient",
  authMiddleware,
  authorizeRoles(["customer"]),
  getPatientDocuments
);

// Get dentist documents
router.get(
  "/dentist",
  authMiddleware,
  authorizeRoles(["doctor"]),
  getDentistDocuments
);

// Get documents for a specific appointment
router.get(
  "/appointment/:appointmentId",
  authMiddleware,
  getAppointmentDocuments
);

// Download document
router.get("/download/:documentId", authMiddleware, downloadDocument);

// Delete document
router.delete(
  "/:documentId",
  authMiddleware,
  authorizeRoles(["doctor"]),
  deleteDocument
);

module.exports = router;
