// filepath: c:\Users\papas\New folder\backend\controllers\document.controllers.js
const Document = require("../models/document.model");
const path = require("path");
const fs = require("fs");

/**
 * Upload a new document
 */
const uploadDocument = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const { patientId, appointmentId, description, category } = req.body;
    const dentistId = req.user.userId;

    // Create the file URL (relative path from server root)
    const fileUrl = `/uploads/${req.file.filename}`;

    // Create new document record
    const document = new Document({
      name: req.body.name || req.file.originalname,
      originalName: req.file.originalname,
      fileUrl,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      patient: patientId,
      dentist: dentistId,
      appointment: appointmentId || null,
      description,
      category: category || "other",
    });

    await document.save();

    return res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      data: document,
    });
  } catch (error) {
    console.error("Error uploading document:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while uploading document",
    });
  }
};

/**
 * Get all documents for a patient
 */
const getPatientDocuments = async (req, res) => {
  try {
    const patientId = req.user.userId;

    const documents = await Document.find({ patient: patientId })
      .populate("dentist", "username")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: documents.length,
      data: documents,
    });
  } catch (error) {
    console.error("Error fetching patient documents:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching documents",
    });
  }
};

/**
 * Get all documents uploaded by a dentist
 */
const getDentistDocuments = async (req, res) => {
  try {
    const dentistId = req.user.userId;

    const documents = await Document.find({ dentist: dentistId })
      .populate("patient", "username")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: documents.length,
      data: documents,
    });
  } catch (error) {
    console.error("Error fetching dentist documents:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching documents",
    });
  }
};

/**
 * Get documents for a specific appointment
 */
const getAppointmentDocuments = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const documents = await Document.find({ appointment: appointmentId })
      .populate("dentist", "username")
      .populate("patient", "username")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: documents.length,
      data: documents,
    });
  } catch (error) {
    console.error("Error fetching appointment documents:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching documents",
    });
  }
};

/**
 * Download a document
 */
const downloadDocument = async (req, res) => {
  try {
    const { documentId } = req.params;

    const document = await Document.findById(documentId);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    // Check if user is authorized to download this document
    if (
      req.user.userId != document.patient &&
      req.user.userId != document.dentist
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to download this document",
      });
    }

    // Get file path
    const filePath = path.join(__dirname, "..", document.fileUrl);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "File not found on server",
      });
    }

    // Set Content-Disposition header for download
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${document.originalName}"`
    );

    // Send file
    return res.sendFile(filePath);
  } catch (error) {
    console.error("Error downloading document:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while downloading document",
    });
  }
};

/**
 * Delete a document
 */
const deleteDocument = async (req, res) => {
  try {
    const { documentId } = req.params;

    const document = await Document.findById(documentId);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    // Only the dentist who uploaded the document can delete it
    if (req.user.userId != document.dentist) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this document",
      });
    }

    // Delete file from server
    const filePath = path.join(__dirname, "..", document.fileUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete document from database
    await Document.findByIdAndDelete(documentId);

    return res.status(200).json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting document:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting document",
    });
  }
};

module.exports = {
  uploadDocument,
  getPatientDocuments,
  getDentistDocuments,
  getAppointmentDocuments,
  downloadDocument,
  deleteDocument,
};
