import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaUserMd, FaCalendarAlt, FaTooth } from "react-icons/fa";
import React from "react";

const Home = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {user ? (
        // Logged-in user view
        <div>
          <h1 className="text-3xl font-bold text-center mb-8">
            Welcome back, <span className="text-blue-600">{user.username}</span>
            !
          </h1>

          {user.role === "customer" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-all">
                <div className="flex items-center mb-4">
                  <FaUserMd className="text-blue-500 text-2xl mr-3" />
                  <h2 className="text-xl font-bold">Find a Dentist</h2>
                </div>
                <p className="text-gray-600 mb-4">
                  Browse our network of qualified dentists and find the perfect
                  match for your dental needs.
                </p>
                <Link
                  to="/dentists"
                  className="text-blue-500 font-semibold hover:underline inline-flex items-center"
                >
                  Find Dentists <span className="ml-1">→</span>
                </Link>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition-all">
                <div className="flex items-center mb-4">
                  <FaCalendarAlt className="text-green-500 text-2xl mr-3" />
                  <h2 className="text-xl font-bold">My Appointments</h2>
                </div>
                <p className="text-gray-600 mb-4">
                  View and manage your upcoming and past dental appointments.
                </p>
                <Link
                  to="/appointments"
                  className="text-green-500 font-semibold hover:underline inline-flex items-center"
                >
                  View Appointments <span className="ml-1">→</span>
                </Link>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500 hover:shadow-lg transition-all">
                <div className="flex items-center mb-4">
                  <FaTooth className="text-purple-500 text-2xl mr-3" />
                  <h2 className="text-xl font-bold">Dental Tips</h2>
                </div>
                <p className="text-gray-600 mb-4">
                  Discover tips and best practices for maintaining optimal
                  dental health.
                </p>
                <a
                  href="#"
                  className="text-purple-500 font-semibold hover:underline inline-flex items-center"
                >
                  Read Tips <span className="ml-1">→</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-all">
                <div className="flex items-center mb-4">
                  <FaCalendarAlt className="text-blue-500 text-2xl mr-3" />
                  <h2 className="text-xl font-bold">Patient Appointments</h2>
                </div>
                <p className="text-gray-600 mb-4">
                  View and manage all your patient appointments.
                </p>
                <Link
                  to="/patients"
                  className="text-blue-500 font-semibold hover:underline inline-flex items-center"
                >
                  View Appointments <span className="ml-1">→</span>
                </Link>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition-all">
                <div className="flex items-center mb-4">
                  <FaTooth className="text-green-500 text-2xl mr-3" />
                  <h2 className="text-xl font-bold">Your Profile</h2>
                </div>
                <p className="text-gray-600 mb-4">
                  Update your professional profile and availability.
                </p>
                <Link
                  to="/profile"
                  className="text-green-500 font-semibold hover:underline inline-flex items-center"
                >
                  Update Profile <span className="ml-1">→</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      ) : (
        // Public home page view
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Welcome to DentaCare
            </h1>
            <p className="text-xl text-gray-600">
              Your trusted partner for dental health
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 mb-10">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-6 md:mb-0">
                <img
                  src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                  alt="Dental Care"
                  className="rounded-lg shadow-md"
                />
              </div>
              <div className="md:w-1/2 md:pl-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Professional Dental Care
                </h2>
                <p className="text-gray-600 mb-6">
                  Our platform connects you with top dental professionals.
                  Whether you need a routine checkup, emergency care, or
                  cosmetic dentistry, we've got you covered.
                </p>
                <Link
                  to="/login"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-center">
                <div className="bg-blue-100 p-3 rounded-full inline-block mb-4">
                  <FaUserMd className="text-blue-600 text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Qualified Dentists
                </h3>
                <p className="text-gray-600">
                  Access our network of verified dental professionals.
                </p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-center">
                <div className="bg-green-100 p-3 rounded-full inline-block mb-4">
                  <FaCalendarAlt className="text-green-600 text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Easy Booking</h3>
                <p className="text-gray-600">
                  Book appointments with just a few clicks.
                </p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-center">
                <div className="bg-purple-100 p-3 rounded-full inline-block mb-4">
                  <FaTooth className="text-purple-600 text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Complete Records</h3>
                <p className="text-gray-600">
                  Access your dental history and prescriptions anytime.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
