import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import React from "react";
import { toast } from "react-toastify";
import {
  FaUser,
  FaStar,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
} from "react-icons/fa";

const DentistDetails = () => {
  const { dentistId } = useParams();
  const navigate = useNavigate();
  const [dentist, setDentist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDentistDetails = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get(
          `http://localhost:3000/api/users/profile/${dentistId}`,
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

  const handleBookAppointment = () => {
    navigate(`/appointments/new/${dentistId}`);
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
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Banner and Profile */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 relative">
          <button
            onClick={() => navigate("/dentists")}
            className="absolute top-4 left-4 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full p-2 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <div className="flex flex-col md:flex-row items-center">
            <div className="mb-6 md:mb-0 md:mr-6">
              {dentist.profilePicture ? (
                <img
                  src={dentist.profilePicture}
                  alt={dentist.username}
                  className="h-28 w-28 rounded-full object-cover border-4 border-white"
                />
              ) : (
                <div className="h-28 w-28 rounded-full bg-white text-blue-600 flex items-center justify-center text-3xl font-bold">
                  {dentist.username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold text-white">
                Dr. {dentist.username}
              </h1>
              <div className="text-blue-100 mb-2">
                {dentist.specialization || "General Dentist"}
              </div>

              {dentist.experience !== undefined && (
                <div className="inline-flex items-center bg-blue-700 bg-opacity-50 px-3 py-1 rounded-full text-blue-50">
                  <FaStar className="text-yellow-400 mr-2" />
                  <span>{dentist.experience} years of experience</span>
                </div>
              )}
            </div>

            <div className="md:ml-auto mt-6 md:mt-0">
              <button
                onClick={handleBookAppointment}
                className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium text-lg flex items-center"
              >
                <FaCalendarAlt className="mr-2" /> Book Appointment
              </button>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                About Dr. {dentist.username}
              </h2>
              <p className="text-gray-600 mb-6">
                {dentist.medicalHistory ||
                  "Dr. " +
                    dentist.username +
                    " is a qualified dental professional with expertise in dental care and oral health."}
              </p>

              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Contact Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <FaEnvelope className="text-blue-500 mr-3" />
                  <span>{dentist.email}</span>
                </div>

                {dentist.phoneNumber && (
                  <div className="flex items-center text-gray-600">
                    <FaPhone className="text-blue-500 mr-3" />
                    <span>{dentist.phoneNumber}</span>
                  </div>
                )}

                {dentist.address && (
                  <div className="flex items-center text-gray-600">
                    <FaMapMarkerAlt className="text-blue-500 mr-3" />
                    <span>{dentist.address}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Availability
              </h2>

              {dentist.availability && dentist.availability.length > 0 ? (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <ul className="space-y-3">
                    {dentist.availability.map((slot, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center border-b border-gray-200 pb-2 last:border-0 last:pb-0"
                      >
                        <span className="font-medium">{slot.day}</span>
                        <span className="text-gray-600">
                          {slot.startTime} - {slot.endTime}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-gray-500">
                  Contact for availability details.
                </div>
              )}

              <div className="mt-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Specializations
                </h2>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                    {dentist.specialization || "General Dentistry"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={handleBookAppointment}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg inline-flex items-center"
        >
          <FaCalendarAlt className="mr-2" /> Schedule an Appointment
        </button>
      </div>
    </div>
  );
};

export default DentistDetails;
