import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import React from "react";
import {
  FaUser,
  FaCalendar,
  FaClock,
  FaTooth,
  FaPencilAlt,
} from "react-icons/fa";

const AppointmentForm = () => {
  const { dentistId } = useParams();
  const navigate = useNavigate();
  const [dentist, setDentist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Form state
  const [appointmentDate, setAppointmentDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [dentalIssue, setDentalIssue] = useState("");
  const [painLevel, setPainLevel] = useState(1);
  const [symptoms, setSymptoms] = useState("");
  const [issueStartDate, setIssueStartDate] = useState("");
  const [previousTreatments, setPreviousTreatments] = useState("");
  const [notes, setNotes] = useState("");

  // Get available time slots
  const timeSlots = [
    "09:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "01:00 PM - 02:00 PM",
    "02:00 PM - 03:00 PM",
    "03:00 PM - 04:00 PM",
    "04:00 PM - 05:00 PM",
  ];

  // Calculate min date for appointment (today)
  const today = new Date().toISOString().split("T")[0];

  // Fetch dentist details
  useEffect(() => {
    const fetchDentistDetails = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get(
          `https://dental-care-app.onrender.com/api/users/profile/${dentistId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setDentist(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching dentist details:", error);
        toast.error("Failed to load dentist details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDentistDetails();
  }, [dentistId]);

  // Get current user role
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login to book appointments");
        navigate("/login");
        return;
      }

      try {
        // Fetch the current user information to verify role
        const response = await axios.get(
          "https://dental-care-app.onrender.com/api/users/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setCurrentUser(response.data.data);

          // Check if user role is correct
          if (response.data.data.role !== "customer") {
            toast.error("Only patients can book appointments");
            navigate("/");
          }
        }
      } catch (error) {
        console.error("Authentication error:", error);
        toast.error("Authentication failed. Please login again.");
        // Clear invalid token
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchCurrentUser();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        "https://dental-care-app.onrender.com/api/appointments",
        {
          dentistId,
          appointmentDate,
          timeSlot,
          dentalIssue,
          painLevel: parseInt(painLevel),
          symptoms,
          issueStartDate: issueStartDate || undefined,
          previousTreatments,
          notes,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Appointment booked successfully!");
        navigate("/appointments");
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to book appointment. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!dentist) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <FaUser className="mx-auto text-gray-400 text-5xl mb-4" />
          <h3 className="text-xl font-semibold text-gray-600">
            Dentist not found
          </h3>
          <p className="text-gray-500 mt-2">
            The dentist you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/dentists")}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Go Back to Dentists
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
            <h1 className="text-2xl font-bold text-white">
              Book an Appointment
            </h1>
            <p className="text-blue-100">
              with Dr. {dentist.username} •{" "}
              {dentist.specialization || "General Dentist"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Appointment Date */}
              <div>
                <label className="block text-gray-700 font-medium mb-2 flex items-center">
                  <FaCalendar className="mr-2 text-blue-500" />
                  Appointment Date
                </label>
                <input
                  type="date"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  min={today}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Time Slot */}
              <div>
                <label className="block text-gray-700 font-medium mb-2 flex items-center">
                  <FaClock className="mr-2 text-blue-500" />
                  Preferred Time
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a time slot</option>
                  {timeSlots.map((slot, index) => (
                    <option key={index} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Dental Issue */}
            <div className="mt-6">
              <label className="block text-gray-700 font-medium mb-2 flex items-center">
                <FaTooth className="mr-2 text-blue-500" />
                Dental Issue
              </label>
              <input
                type="text"
                value={dentalIssue}
                onChange={(e) => setDentalIssue(e.target.value)}
                placeholder="E.g., Toothache, Cavity, Cleaning"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Pain Level */}
            <div className="mt-6">
              <label className="block text-gray-700 font-medium mb-2">
                Pain Level (1-10)
              </label>
              <div className="flex items-center">
                <span className="text-gray-500">Mild</span>
                <input
                  type="range"
                  value={painLevel}
                  onChange={(e) => setPainLevel(e.target.value)}
                  min="1"
                  max="10"
                  className="mx-4 flex-grow"
                  required
                />
                <span className="text-gray-500">Severe</span>
                <span className="ml-4 bg-blue-100 text-blue-800 px-2 py-1 rounded-md font-medium">
                  {painLevel}
                </span>
              </div>
            </div>

            {/* Symptoms */}
            <div className="mt-6">
              <label className="block text-gray-700 font-medium mb-2 flex items-center">
                <FaPencilAlt className="mr-2 text-blue-500" />
                Symptoms
              </label>
              <textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Describe your symptoms in detail"
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* Issue Start Date */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  When did the issue start?
                </label>
                <input
                  type="date"
                  value={issueStartDate}
                  onChange={(e) => setIssueStartDate(e.target.value)}
                  max={today}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Previous Treatments */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Previous Treatments (if any)
                </label>
                <input
                  type="text"
                  value={previousTreatments}
                  onChange={(e) => setPreviousTreatments(e.target.value)}
                  placeholder="E.g., Pain reliever, Antibiotic"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Additional Notes */}
            <div className="mt-6">
              <label className="block text-gray-700 font-medium mb-2">
                Additional Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any other information you'd like the dentist to know"
                rows="2"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            {/* Submit and Cancel Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate(`/dentists/${dentistId}`)}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Booking...
                  </>
                ) : (
                  "Book Appointment"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AppointmentForm;
