const Appointment = require("../models/appointment.model");
const User = require("../models/user.model");

/**
 * Create new appointment
 */
const createAppointment = async (req, res) => {
  try {
    const {
      dentistId,
      appointmentDate,
      timeSlot,
      dentalIssue,
      painLevel,
      symptoms,
      issueStartDate,
      previousTreatments,
      notes,
    } = req.body;

    // Get patient ID from authenticated user
    const patientId = req.user.userId;

    // Validate dentist exists and is a doctor
    const dentist = await User.findOne({ _id: dentistId, role: "doctor" });
    if (!dentist) {
      return res.status(404).json({
        success: false,
        message: "Dentist not found",
      });
    }

    // Create new appointment
    const appointment = new Appointment({
      patient: patientId,
      dentist: dentistId,
      appointmentDate,
      timeSlot,
      dentalIssue,
      painLevel,
      symptoms,
      issueStartDate,
      previousTreatments,
      notes,
    });

    await appointment.save();

    return res.status(201).json({
      success: true,
      message: "Appointment created successfully",
      data: appointment,
    });
  } catch (error) {
    console.error("Error creating appointment:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors)
          .map((val) => val.message)
          .join(", "),
      });
    }

    return res.status(500).json({
      success: false,
      message: "An error occurred while creating appointment",
    });
  }
};

/**
 * Get appointments by patient ID
 */
const getPatientAppointments = async (req, res) => {
  try {
    // Get patient ID from authenticated user
    const patientId = req.user.userId;

    const appointments = await Appointment.find({ patient: patientId })
      .populate("dentist", "username profilePicture specialization experience")
      .sort({ appointmentDate: 1 });

    return res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    console.error("Error fetching patient appointments:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching appointments",
    });
  }
};

/**
 * Get appointments by dentist ID
 */
const getDentistAppointments = async (req, res) => {
  try {
    // Get dentist ID from authenticated user
    const dentistId = req.user.userId;

    const appointments = await Appointment.find({ dentist: dentistId })
      .populate(
        "patient",
        "username profilePicture dateOfBirth medicalHistory allergies"
      )
      .sort({ appointmentDate: 1 });

    return res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    console.error("Error fetching dentist appointments:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching appointments",
    });
  }
};

/**
 * Update appointment status
 */
const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status } = req.body;

    // Validate status
    if (!["pending", "confirmed", "completed", "cancelled"].includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid status. Must be 'pending', 'confirmed', 'completed', or 'cancelled'",
      });
    }

    // Find and update appointment
    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status },
      { new: true, runValidators: true }
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Appointment status updated successfully",
      data: appointment,
    });
  } catch (error) {
    console.error("Error updating appointment status:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating appointment status",
    });
  }
};

/**
 * Get single appointment by ID
 */
const getAppointmentById = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findById(appointmentId)
      .populate(
        "patient",
        "username profilePicture dateOfBirth medicalHistory allergies"
      )
      .populate("dentist", "username profilePicture specialization experience");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Check if user is authorized to view this appointment
    if (
      req.user.userId != appointment.patient._id &&
      req.user.userId != appointment.dentist._id
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this appointment",
      });
    }

    return res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    console.error("Error fetching appointment:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching appointment",
    });
  }
};

module.exports = {
  createAppointment,
  getPatientAppointments,
  getDentistAppointments,
  updateAppointmentStatus,
  getAppointmentById,
};
