import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import React from "react";
import { toast } from "react-toastify";
import {
  FaCalendarCheck,
  FaCalendarTimes,
  FaCalendarDay,
  FaArrowLeft,
  FaTooth,
  FaNotesMedical,
  FaUserMd,
  FaUser,
  FaFileAlt,
} from "react-icons/fa";

// Import our document components
import DocumentUpload from "../components/DocumentUpload";
import DocumentList from "../components/DocumentList";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  completed: "bg-blue-100 text-blue-800",
  cancelled: "bg-red-100 text-red-800",
};

const statusIcons = {
  pending: <FaCalendarDay className="text-yellow-500" />,
  confirmed: <FaCalendarCheck className="text-green-500" />,
  completed: <FaCalendarCheck className="text-blue-500" />,
  cancelled: <FaCalendarTimes className="text-red-500" />,
};

const AppointmentDetails = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [documentsKey, setDocumentsKey] = useState(Date.now()); // For refreshing documents list after upload

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get(
          `https://dental-care-app.onrender.com/api/appointments/${appointmentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setAppointment(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching appointment details:", error);
        toast.error(
          error.response?.data?.message ||
            "Failed to load appointment details. Please try again."
        );
        navigate("/appointments");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointmentDetails();
  }, [appointmentId, navigate]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleStatusUpdate = async (newStatus) => {
    const token = localStorage.getItem("token");
    setUpdatingStatus(true);

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
        toast.success(`Appointment ${newStatus} successfully!`);
        // Update the local appointment state
        setAppointment({
          ...appointment,
          status: newStatus,
        });
      }
    } catch (error) {
      console.error("Error updating appointment status:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to update appointment status. Please try again."
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Handler for successful document upload
  const handleDocumentUpload = () => {
    // Refresh the documents list by updating the key
    setDocumentsKey(Date.now());
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <FaCalendarDay className="mx-auto text-gray-400 text-5xl mb-4" />
          <h3 className="text-xl font-semibold text-gray-600">
            Appointment not found
          </h3>
          <p className="text-gray-500 mt-2">
            The appointment you're looking for doesn't exist or has been
            removed.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const isCustomer = user?.role === "customer";
  const isDoctor = user?.role === "doctor";
  const isPending = appointment.status === "pending";
  const isConfirmed = appointment.status === "confirmed";
  const isCompleted = appointment.status === "completed";
  const isCancelled = appointment.status === "cancelled";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-800"
        >
          <FaArrowLeft className="mr-2" /> Back to appointments
        </button>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
            <h1 className="text-2xl font-bold text-white mb-1">
              Appointment Details
            </h1>
            <div className="flex items-center">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-20 text-black mr-2`}
              >
                {appointment.timeSlot}
              </span>
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
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaCalendarCheck className="mr-2 text-blue-500" />
                  Appointment Information
                </h2>
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <div className="mb-3">
                    <span className="block text-sm text-gray-500">Date</span>
                    <span className="font-medium">
                      {formatDate(appointment.appointmentDate)}
                    </span>
                  </div>
                  <div className="mb-3">
                    <span className="block text-sm text-gray-500">Time</span>
                    <span className="font-medium">{appointment.timeSlot}</span>
                  </div>
                  <div className="mb-3">
                    <span className="block text-sm text-gray-500">
                      Issue Type
                    </span>
                    <span className="font-medium">
                      {appointment.dentalIssue}
                    </span>
                  </div>
                  <div>
                    <span className="block text-sm text-gray-500">
                      Pain Level
                    </span>
                    <div className="flex items-center">
                      <div className="relative w-full h-2 bg-gray-200 rounded overflow-hidden">
                        <div
                          className="absolute top-0 left-0 h-full bg-blue-500"
                          style={{
                            width: `${(appointment.painLevel / 10) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <span className="ml-2 text-blue-800 font-medium">
                        {appointment.painLevel}/10
                      </span>
                    </div>
                  </div>
                </div>

                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  {isCustomer ? (
                    <>
                      <FaUserMd className="mr-2 text-blue-500" />
                      Dentist Information
                    </>
                  ) : (
                    <>
                      <FaUser className="mr-2 text-blue-500" />
                      Patient Information
                    </>
                  )}
                </h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-4">
                    {isCustomer ? (
                      // Dentist information for patient view
                      <>
                        {appointment.dentist?.profilePicture ? (
                          <img
                            src={appointment.dentist.profilePicture}
                            alt={appointment.dentist.username}
                            className="h-14 w-14 rounded-full object-cover mr-4"
                          />
                        ) : (
                          <div className="h-14 w-14 rounded-full bg-blue-500 text-white flex items-center justify-center mr-4 text-xl font-bold">
                            {appointment.dentist?.username
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-lg">
                            Dr. {appointment.dentist?.username}
                          </div>
                          <div className="text-gray-500">
                            {appointment.dentist?.specialization ||
                              "General Dentist"}
                          </div>
                        </div>
                      </>
                    ) : (
                      // Patient information for dentist view
                      <>
                        {appointment.patient?.profilePicture ? (
                          <img
                            src={appointment.patient.profilePicture}
                            alt={appointment.patient.username}
                            className="h-14 w-14 rounded-full object-cover mr-4"
                          />
                        ) : (
                          <div className="h-14 w-14 rounded-full bg-blue-500 text-white flex items-center justify-center mr-4 text-xl font-bold">
                            {appointment.patient?.username
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-lg">
                            {appointment.patient?.username}
                          </div>
                          <div className="text-gray-500">
                            {appointment.patient?.email}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Show additional patient info for doctors */}
                  {isDoctor && appointment.patient?.dateOfBirth && (
                    <div className="mt-3">
                      <span className="block text-sm text-gray-500">
                        Date of Birth
                      </span>
                      <span className="font-medium">
                        {formatDate(appointment.patient.dateOfBirth)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaTooth className="mr-2 text-blue-500" />
                  Dental Issue Details
                </h2>
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <div className="mb-4">
                    <span className="block text-sm text-gray-500 mb-1">
                      Symptoms
                    </span>
                    <p className="text-gray-800">{appointment.symptoms}</p>
                  </div>
                  {appointment.issueStartDate && (
                    <div className="mb-4">
                      <span className="block text-sm text-gray-500 mb-1">
                        Issue Started
                      </span>
                      <p className="text-gray-800">
                        {formatDate(appointment.issueStartDate)}
                      </p>
                    </div>
                  )}
                  {appointment.previousTreatments && (
                    <div className="mb-4">
                      <span className="block text-sm text-gray-500 mb-1">
                        Previous Treatments
                      </span>
                      <p className="text-gray-800">
                        {appointment.previousTreatments}
                      </p>
                    </div>
                  )}
                </div>

                {appointment.notes && (
                  <>
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <FaNotesMedical className="mr-2 text-blue-500" />
                      Additional Notes
                    </h2>
                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                      <p className="text-gray-800">{appointment.notes}</p>
                    </div>
                  </>
                )}

                {/* Status Update Options */}
                {isDoctor && !isCompleted && !isCancelled && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      Update Appointment Status
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {isPending && (
                        <button
                          onClick={() => handleStatusUpdate("confirmed")}
                          disabled={updatingStatus}
                          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
                        >
                          Confirm Appointment
                        </button>
                      )}
                      {(isPending || isConfirmed) && (
                        <button
                          onClick={() => handleStatusUpdate("completed")}
                          disabled={updatingStatus}
                          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                        >
                          Mark as Completed
                        </button>
                      )}
                      {!isCancelled && (
                        <button
                          onClick={() => handleStatusUpdate("cancelled")}
                          disabled={updatingStatus}
                          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50"
                        >
                          Cancel Appointment
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Patient can cancel pending appointments */}
                {isCustomer && isPending && (
                  <div className="mt-6">
                    <button
                      onClick={() => handleStatusUpdate("cancelled")}
                      disabled={updatingStatus}
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50"
                    >
                      Cancel Appointment
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Document section */}
            <div className="mt-8 border-t pt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <FaFileAlt className="mr-2 text-blue-500" />
                Medical Documents
              </h2>

              {/* Document upload component for dentists only */}
              {isDoctor && !isCancelled && (
                <DocumentUpload
                  patientId={appointment.patient._id}
                  appointmentId={appointmentId}
                  onUploadSuccess={handleDocumentUpload}
                />
              )}

              {/* Document list component for both dentists and patients */}
              <DocumentList
                key={documentsKey}
                appointmentId={appointmentId}
                isPatient={isCustomer}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetails;
