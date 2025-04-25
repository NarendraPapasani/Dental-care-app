import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaUser, FaStar, FaMapMarkerAlt } from "react-icons/fa";

const DentistList = () => {
  const [dentists, setDentists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [specialization, setSpecialization] = useState("");

  // Fetch dentists from API
  useEffect(() => {
    const fetchDentists = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get(
          "http://localhost:3000/api/users/role/doctor",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setDentists(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching dentists:", error);
        toast.error("Failed to load dentists. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDentists();
  }, []);

  // Filter dentists by search term and specialization
  const filteredDentists = dentists.filter((dentist) => {
    const matchesSearchTerm =
      dentist.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (dentist.specialization &&
        dentist.specialization
          .toLowerCase()
          .includes(searchTerm.toLowerCase()));

    const matchesSpecialization =
      specialization === "" || dentist.specialization === specialization;

    return matchesSearchTerm && matchesSpecialization;
  });

  // Get unique specializations for filter dropdown
  const specializations = [
    ...new Set(
      dentists.map((dentist) => dentist.specialization).filter(Boolean)
    ),
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
          Find a Dentist
        </h1>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search dentists..."
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
          >
            <option value="">All Specializations</option>
            {specializations.map((spec, index) => (
              <option key={index} value={spec}>
                {spec}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredDentists.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <FaUser className="mx-auto text-gray-400 text-5xl mb-4" />
          <h3 className="text-xl font-semibold text-gray-600">
            No dentists found
          </h3>
          <p className="text-gray-500 mt-2">
            Try changing your search criteria or check back later.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDentists.map((dentist) => (
            <Link
              to={`/dentists/${dentist._id}`}
              key={dentist._id}
              className="block"
            >
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
                  <div className="flex items-center space-x-4">
                    {dentist.profilePicture ? (
                      <img
                        src={dentist.profilePicture}
                        alt={dentist.username}
                        className="h-16 w-16 rounded-full object-cover border-2 border-white"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-full bg-white text-blue-600 flex items-center justify-center text-xl font-bold">
                        {dentist.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        Dr. {dentist.username}
                      </h2>
                      {dentist.specialization && (
                        <p className="text-blue-100">
                          {dentist.specialization}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  {dentist.experience !== undefined && (
                    <div className="flex items-center text-gray-600 mb-2">
                      <FaStar className="text-yellow-500 mr-2" />
                      <span>{dentist.experience} years experience</span>
                    </div>
                  )}

                  {dentist.address && (
                    <div className="flex items-center text-gray-600">
                      <FaMapMarkerAlt className="text-red-500 mr-2" />
                      <span>{dentist.address}</span>
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <button className="w-full py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors font-medium">
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default DentistList;
