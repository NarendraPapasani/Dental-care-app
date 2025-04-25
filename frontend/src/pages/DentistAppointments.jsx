import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaCalendarCheck,
  FaCalendarTimes,
  FaCalendarDay,
  FaCalendarWeek,
  FaUser,
} from "react-icons/fa";

const statusIcons = {
  pending: <FaCalendarDay className="text-yellow-500" />,
  confirmed: <FaCalendarCheck className="text-green-500" />,
  completed: <FaCalendarCheck className="text-blue-500" />,
  cancelled: <FaCalendarTimes className="text-red-500" />,
};

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  completed: "bg-blue-100 text-blue-800",
  cancelled: "bg-red-100 text-red-800",
};

const DentistAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [viewMode, setViewMode] = useState("upcoming");

  useEffect(() => {
    const fetchAppointments = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get(
          "https://dental-care-app.onrender.com/api/appointments/dentist",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setAppointments(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
        toast.error("Failed to load appointments. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Filter appointments based on selected filter and view mode
  const filteredAppointments = appointments.filter((appointment) => {
    const today = new Date();
    const appointmentDate = new Date(appointment.appointmentDate);

    // Filter by status
    const statusMatch = filter === "all" || appointment.status === filter;

    // Filter by date (upcoming or past)
    const dateMatch =
      (viewMode === "upcoming" && appointmentDate >= today) ||
      (viewMode === "past" && appointmentDate < today);

    return statusMatch && dateMatch;
  });

  // Sort appointments by date
  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    const dateA = new Date(a.appointmentDate);
    const dateB = new Date(b.appointmentDate);
    return viewMode === "upcoming" ? dateA - dateB : dateB - dateA;
  });

  // Group appointments by date
  const groupedAppointments = sortedAppointments.reduce(
    (groups, appointment) => {
      const date = formatDate(appointment.appointmentDate);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(appointment);
      return groups;
    },
    {}
  );

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.patch(
        `https://dental-care-app.onrender.com/api/appointments/${appointmentId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        // Update state with new status
        setAppointments(
          appointments.map((appt) =>
            appt._id === appointmentId ? { ...appt, status: newStatus } : appt
          )
        );
        toast.success(`Appointment ${newStatus} successfully!`);
      }
    } catch (error) {
      console.error("Error updating appointment status:", error);
      toast.error("Failed to update appointment status. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Patient Appointments
      </h1>

      {/* View toggle */}
      <div className="flex mb-6">
        <button
          onClick={() => setViewMode("upcoming")}
          className={`px-4 py-2 ${
            viewMode === "upcoming"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700"
          } rounded-l-lg font-medium`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setViewMode("past")}
          className={`px-4 py-2 ${
            viewMode === "past"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700"
          } rounded-r-lg font-medium`}
        >
          Past
        </button>
      </div>

      {/* Filter buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg font-medium ${
            filter === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("pending")}
          className={`px-4 py-2 rounded-lg font-medium flex items-center ${
            filter === "pending"
              ? "bg-yellow-500 text-white"
              : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
          }`}
        >
          <FaCalendarDay className="mr-2" /> Pending
        </button>
        <button
          onClick={() => setFilter("confirmed")}
          className={`px-4 py-2 rounded-lg font-medium flex items-center ${
            filter === "confirmed"
              ? "bg-green-500 text-white"
              : "bg-green-100 text-green-800 hover:bg-green-200"
          }`}
        >
          <FaCalendarCheck className="mr-2" /> Confirmed
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`px-4 py-2 rounded-lg font-medium flex items-center ${
            filter === "completed"
              ? "bg-blue-500 text-white"
              : "bg-blue-100 text-blue-800 hover:bg-blue-200"
          }`}
        >
          <FaCalendarWeek className="mr-2" /> Completed
        </button>
        <button
          onClick={() => setFilter("cancelled")}
          className={`px-4 py-2 rounded-lg font-medium flex items-center ${
            filter === "cancelled"
              ? "bg-red-500 text-white"
              : "bg-red-100 text-red-800 hover:bg-red-200"
          }`}
        >
          <FaCalendarTimes className="mr-2" /> Cancelled
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <FaCalendarDay className="mx-auto text-gray-400 text-5xl mb-4" />
          <h3 className="text-xl font-semibold text-gray-600">
            No appointments yet
          </h3>
          <p className="text-gray-500 mt-2">
            You don't have any patient appointments yet.
          </p>
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <FaCalendarDay className="mx-auto text-gray-400 text-5xl mb-4" />
          <h3 className="text-xl font-semibold text-gray-600">
            No {filter !== "all" ? filter : ""} appointments{" "}
            {viewMode === "upcoming" ? "scheduled" : "found"}
          </h3>
          <p className="text-gray-500 mt-2">
            {viewMode === "upcoming"
              ? `You don't have any ${
                  filter !== "all" ? filter : ""
                } appointments scheduled.`
              : `You don't have any ${
                  filter !== "all" ? filter : ""
                } appointments in the past.`}
          </p>
        </div>
      ) : (
        <div>
          {Object.keys(groupedAppointments).map((date) => (
            <div key={date} className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">{date}</h2>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="divide-y divide-gray-200">
                  {groupedAppointments[date].map((appointment) => (
                    <div key={appointment._id} className="p-4 hover:bg-gray-50">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="flex items-start mb-3 md:mb-0">
                          {/* Patient info */}
                          <div className="flex-shrink-0">
                            {appointment.patient.profilePicture ? (
                              <img
                                src={appointment.patient.profilePicture}
                                alt={appointment.patient.username}
                                className="h-12 w-12 rounded-full object-cover"
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center">
                                <FaUser className="text-lg" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-lg font-semibold text-gray-900">
                              {appointment.patient.username}
                            </div>
                            <div className="text-sm text-gray-600 flex items-center mt-1">
                              <span className="mr-3">
                                {appointment.timeSlot}
                              </span>
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  statusColors[appointment.status]
                                }`}
                              >
                                {statusIcons[appointment.status]}
                                <span className="ml-1">
                                  {appointment.status.charAt(0).toUpperCase() +
                                    appointment.status.slice(1)}
                                </span>
                              </span>
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              {appointment.dentalIssue} (Pain level:{" "}
                              {appointment.painLevel}/10)
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2">
                          <Link
                            to={`/appointments/${appointment._id}`}
                            className="px-3 py-1.5 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 font-medium text-sm"
                          >
                            View Details
                          </Link>

                          {appointment.status === "pending" && (
                            <button
                              onClick={() =>
                                handleStatusUpdate(appointment._id, "confirmed")
                              }
                              className="px-3 py-1.5 bg-green-100 text-green-600 rounded hover:bg-green-200 font-medium text-sm"
                            >
                              Confirm
                            </button>
                          )}

                          {(appointment.status === "pending" ||
                            appointment.status === "confirmed") && (
                            <button
                              onClick={() =>
                                handleStatusUpdate(appointment._id, "completed")
                              }
                              className="px-3 py-1.5 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 font-medium text-sm"
                            >
                              Complete
                            </button>
                          )}

                          {appointment.status !== "cancelled" &&
                            appointment.status !== "completed" && (
                              <button
                                onClick={() =>
                                  handleStatusUpdate(
                                    appointment._id,
                                    "cancelled"
                                  )
                                }
                                className="px-3 py-1.5 bg-red-100 text-red-600 rounded hover:bg-red-200 font-medium text-sm"
                              >
                                Cancel
                              </button>
                            )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DentistAppointments;
