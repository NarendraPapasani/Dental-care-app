const router = require("express").Router();
const {
  createAppointment,
  getPatientAppointments,
  getDentistAppointments,
  updateAppointmentStatus,
  getAppointmentById,
} = require("../controllers/appointment.controllers");
const {
  authMiddleware,
  authorizeRoles,
} = require("../middleware/auth.middleware");

// Create new appointment
router.post(
  "/",
  authMiddleware,
  authorizeRoles(["customer"]),
  createAppointment
);

// Get patient's appointments
router.get(
  "/patient",
  authMiddleware,
  authorizeRoles(["customer"]),
  getPatientAppointments
);

// Get dentist's appointments
router.get(
  "/dentist",
  authMiddleware,
  authorizeRoles(["doctor"]),
  getDentistAppointments
);

// More specific routes first
router.patch("/:appointmentId/status", authMiddleware, updateAppointmentStatus);

// General routes last
router.get("/:appointmentId", authMiddleware, getAppointmentById);

module.exports = router;
