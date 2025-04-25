import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import React from "react";
import { toast } from "react-toastify";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaClock,
  FaNotesMedical,
  FaSave,
} from "react-icons/fa";

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    address: "",
    specialization: "",
    experience: "",
    medicalHistory: "",
    allergies: "",
    dateOfBirth: "",
  });

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);

    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get(
          `https://dental-care-app.onrender.com/api/users/profile/${parsedUser.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          const userData = response.data.data;

          // Format date of birth if exists
          if (userData.dateOfBirth) {
            userData.dateOfBirth = new Date(userData.dateOfBirth)
              .toISOString()
              .split("T")[0];
          }

          setFormData({
            username: userData.username || "",
            email: userData.email || "",
            phoneNumber: userData.phoneNumber || "",
            address: userData.address || "",
            specialization: userData.specialization || "",
            experience: userData.experience || "",
            medicalHistory: userData.medicalHistory || "",
            allergies: userData.allergies || "",
            dateOfBirth: userData.dateOfBirth || "",
          });
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        toast.error("Failed to load profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const token = localStorage.getItem("token");

    try {
      const response = await axios.put(
        `https://dental-care-app.onrender.com/api/users/profile/${user.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Profile updated successfully!");

        // Update local storage with new username if changed
        if (formData.username !== user.username) {
          const updatedUser = {
            ...user,
            username: formData.username,
          };
          localStorage.setItem("user", JSON.stringify(updatedUser));
          setUser(updatedUser);
        }
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to update profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const isDoctor = user?.role === "doctor";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Profile</h1>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
            <div className="flex flex-col md:flex-row items-center">
              <div className="mb-4 md:mb-0 md:mr-6">
                <div className="h-24 w-24 rounded-full bg-white text-blue-600 flex items-center justify-center text-4xl font-bold">
                  {formData.username.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="text-white text-center md:text-left">
                <h2 className="text-2xl font-bold">
                  {isDoctor ? `Dr. ${formData.username}` : formData.username}
                </h2>
                <p className="text-blue-100">{user.email}</p>
                <div className="mt-2 inline-flex items-center bg-blue-700 bg-opacity-50 px-3 py-1 rounded-full text-blue-50">
                  {isDoctor ? "Dentist" : "Patient"}
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Basic Information
                </h3>

                <div className="space-y-4">
                  {/* Username */}
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2 flex items-center">
                      <FaUser className="mr-2 text-gray-500" />
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      minLength={3}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2 flex items-center">
                      <FaEnvelope className="mr-2 text-gray-500" />
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
                      readOnly
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Email cannot be changed
                    </p>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2 flex items-center">
                      <FaPhone className="mr-2 text-gray-500" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Your phone number"
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2 flex items-center">
                      <FaMapMarkerAlt className="mr-2 text-gray-500" />
                      Address
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={2}
                      placeholder="Your address"
                    ></textarea>
                  </div>

                  {/* Date of Birth (for patients) */}
                  {!isDoctor && (
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Role Specific Information */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {isDoctor
                    ? "Professional Information"
                    : "Medical Information"}
                </h3>

                <div className="space-y-4">
                  {isDoctor ? (
                    <>
                      {/* Specialization */}
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2 flex items-center">
                          <FaGraduationCap className="mr-2 text-gray-500" />
                          Specialization
                        </label>
                        <input
                          type="text"
                          name="specialization"
                          value={formData.specialization}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="E.g., Orthodontics, Periodontics"
                        />
                      </div>

                      {/* Experience */}
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2 flex items-center">
                          <FaClock className="mr-2 text-gray-500" />
                          Years of Experience
                        </label>
                        <input
                          type="number"
                          name="experience"
                          value={formData.experience}
                          onChange={handleChange}
                          min="0"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Years of professional experience"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Medical History */}
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2 flex items-center">
                          <FaNotesMedical className="mr-2 text-gray-500" />
                          Medical History
                        </label>
                        <textarea
                          name="medicalHistory"
                          value={formData.medicalHistory}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows={3}
                          placeholder="Any relevant medical history"
                        ></textarea>
                      </div>

                      {/* Allergies */}
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                          Allergies
                        </label>
                        <textarea
                          name="allergies"
                          value={formData.allergies}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows={2}
                          placeholder="Any allergies to medications"
                        ></textarea>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/50 border-t-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2" /> Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
