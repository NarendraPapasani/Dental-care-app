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

const PatientAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchAppointments = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get(
          "http://localhost:3000/api/appointments/patient",
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

  // Filter appointments based on selected filter
  const filteredAppointments = appointments.filter((appointment) => {
    if (filter === "all") return true;
    return appointment.status === filter;
  });

  // Sort appointments by date (newest first for past, oldest first for upcoming)
  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    const dateA = new Date(a.appointmentDate);
    const dateB = new Date(b.appointmentDate);
    const today = new Date();

    const isPastA = dateA < today;
    const isPastB = dateB < today;

    if (isPastA && !isPastB) return 1; // A is past, B is upcoming
    if (!isPastA && isPastB) return -1; // A is upcoming, B is past

    if (isPastA && isPastB) {
      return dateB - dateA; // Both past, newer first
    } else {
      return dateA - dateB; // Both upcoming, sooner first
    }
  });

  // Separate upcoming and past appointments
  const today = new Date();
  const upcomingAppointments = sortedAppointments.filter(
    (appointment) => new Date(appointment.appointmentDate) >= today
  );

  const pastAppointments = sortedAppointments.filter(
    (appointment) => new Date(appointment.appointmentDate) < today
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Appointments</h1>

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
            You haven't booked any appointments yet.
          </p>
          <Link
            to="/dentists"
            className="mt-6 inline-block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Find a Dentist
          </Link>
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <FaCalendarDay className="mx-auto text-gray-400 text-5xl mb-4" />
          <h3 className="text-xl font-semibold text-gray-600">
            No {filter} appointments
          </h3>
          <p className="text-gray-500 mt-2">
            You don't have any appointments with status "{filter}".
          </p>
        </div>
      ) : (
        <div>
          {upcomingAppointments.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Upcoming Appointments
              </h2>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Dentist
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date & Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Dental Issue
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {upcomingAppointments.map((appointment) => (
                        <tr key={appointment._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {appointment.dentist.profilePicture ? (
                                <img
                                  src={appointment.dentist.profilePicture}
                                  alt={appointment.dentist.username}
                                  className="h-10 w-10 rounded-full object-cover mr-3"
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-blue-500 text-white flex items-center justify-center mr-3">
                                  {appointment.dentist.username
                                    .charAt(0)
                                    .toUpperCase()}
                                </div>
                              )}
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  Dr. {appointment.dentist.username}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {appointment.dentist.specialization ||
                                    "General Dentist"}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {formatDate(appointment.appointmentDate)}
                            </div>
                            <div className="text-sm text-gray-500">
                              {appointment.timeSlot}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {appointment.dentalIssue}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                statusColors[appointment.status]
                              }`}
                            >
                              {statusIcons[appointment.status]}
                              <span className="ml-1">
                                {appointment.status.charAt(0).toUpperCase() +
                                  appointment.status.slice(1)}
                              </span>
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link
                              to={`/appointments/${appointment._id}`}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              View Details
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {pastAppointments.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Past Appointments
              </h2>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Dentist
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date & Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Dental Issue
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {pastAppointments.map((appointment) => (
                        <tr key={appointment._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {appointment.dentist.profilePicture ? (
                                <img
                                  src={appointment.dentist.profilePicture}
                                  alt={appointment.dentist.username}
                                  className="h-10 w-10 rounded-full object-cover mr-3"
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-blue-500 text-white flex items-center justify-center mr-3">
                                  {appointment.dentist.username
                                    .charAt(0)
                                    .toUpperCase()}
                                </div>
                              )}
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  Dr. {appointment.dentist.username}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {appointment.dentist.specialization ||
                                    "General Dentist"}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {formatDate(appointment.appointmentDate)}
                            </div>
                            <div className="text-sm text-gray-500">
                              {appointment.timeSlot}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {appointment.dentalIssue}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                statusColors[appointment.status]
                              }`}
                            >
                              {statusIcons[appointment.status]}
                              <span className="ml-1">
                                {appointment.status.charAt(0).toUpperCase() +
                                  appointment.status.slice(1)}
                              </span>
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link
                              to={`/appointments/${appointment._id}`}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              View Details
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PatientAppointments;
