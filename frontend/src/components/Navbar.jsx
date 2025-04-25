import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import React from "react";
import {
  FaUser,
  FaSignOutAlt,
  FaCalendarAlt,
  FaUserMd,
  FaHome,
} from "react-icons/fa";

// Custom event for auth state changes
const AUTH_CHANGE_EVENT = "authStateChange";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Function to check and update user state
  const updateUserState = () => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    // Initial user state
    updateUserState();

    // Listen for auth state changes
    window.addEventListener(AUTH_CHANGE_EVENT, updateUserState);

    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, updateUserState);
    };
  }, []);

  useEffect(() => {
    // Add click event listener to close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    // Attach the event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    // Clear local storage
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // Close the dropdown
    setIsOpen(false);

    // Update user state
    setUser(null);

    // Dispatch event for other components
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));

    // Navigate to login page
    navigate("/login");
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Function to close menu after navigation
  const handleMenuItemClick = () => {
    setIsOpen(false);
  };

  return (
    <nav className="bg-gray-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <FaUserMd className="h-8 w-8 text-blue-400" />
              <span className="ml-2 text-xl font-bold">DentaCare</span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link
              to="/"
              className="px-3 py-2 rounded-md hover:bg-gray-700 flex items-center"
            >
              <FaHome className="mr-1" /> Home
            </Link>

            {user && user.role === "customer" && (
              <>
                <Link
                  to="/dentists"
                  className="px-3 py-2 rounded-md hover:bg-gray-700 flex items-center"
                >
                  <FaUserMd className="mr-1" /> Find Dentists
                </Link>
                <Link
                  to="/appointments"
                  className="px-3 py-2 rounded-md hover:bg-gray-700 flex items-center"
                >
                  <FaCalendarAlt className="mr-1" /> My Appointments
                </Link>
              </>
            )}

            {user && user.role === "doctor" && (
              <Link
                to="/patients"
                className="px-3 py-2 rounded-md hover:bg-gray-700 flex items-center"
              >
                <FaCalendarAlt className="mr-1" /> Appointments
              </Link>
            )}

            {user ? (
              <div className="relative ml-3" ref={dropdownRef}>
                <div className="flex items-center">
                  <button
                    onClick={toggleMenu}
                    className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                  >
                    <span className="sr-only">Open user menu</span>
                    {user.profilePicture ? (
                      <img
                        className="h-8 w-8 rounded-full"
                        src={user.profilePicture}
                        alt="Profile"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </button>
                </div>

                {isOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={handleMenuItemClick}
                    >
                      <FaUser className="inline mr-2" /> Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <FaSignOutAlt className="inline mr-2" /> Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-3 py-2 rounded-md bg-blue-500 hover:bg-blue-600 font-medium"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              <svg
                className={`${isOpen ? "hidden" : "block"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`${isOpen ? "block" : "hidden"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isOpen ? "block" : "hidden"} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            to="/"
            className="block px-3 py-2 rounded-md hover:bg-gray-700"
            onClick={handleMenuItemClick}
          >
            <FaHome className="inline mr-2" /> Home
          </Link>
          {user && user.role === "customer" && (
            <>
              <Link
                to="/dentists"
                className="block px-3 py-2 rounded-md hover:bg-gray-700"
                onClick={handleMenuItemClick}
              >
                <FaUserMd className="inline mr-2" /> Find Dentists
              </Link>
              <Link
                to="/appointments"
                className="block px-3 py-2 rounded-md hover:bg-gray-700"
                onClick={handleMenuItemClick}
              >
                <FaCalendarAlt className="inline mr-2" /> My Appointments
              </Link>
            </>
          )}

          {user && user.role === "doctor" && (
            <Link
              to="/patients"
              className="block px-3 py-2 rounded-md hover:bg-gray-700"
              onClick={handleMenuItemClick}
            >
              <FaCalendarAlt className="inline mr-2" /> Appointments
            </Link>
          )}

          {user ? (
            <>
              <Link
                to="/profile"
                className="block px-3 py-2 rounded-md hover:bg-gray-700"
                onClick={handleMenuItemClick}
              >
                <FaUser className="inline mr-2" /> Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left block px-3 py-2 rounded-md hover:bg-gray-700"
              >
                <FaSignOutAlt className="inline mr-2" /> Sign out
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="block px-3 py-2 rounded-md bg-blue-500 hover:bg-blue-600"
              onClick={handleMenuItemClick}
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
