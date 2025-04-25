import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";

// Pages
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import DentistList from "./pages/DentistList";
import DentistDetails from "./pages/DentistDetails";
import AppointmentForm from "./pages/AppointmentForm";
import PatientAppointments from "./pages/PatientAppointments";
import DentistAppointments from "./pages/DentistAppointments";
import AppointmentDetails from "./pages/AppointmentDetails";
import UserProfile from "./pages/UserProfile";

// Components
import Navbar from "./components/Navbar";

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  if (!user || !token) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return children;
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <BrowserRouter>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Auth />} />

          {/* Customer Protected Routes */}
          <Route
            path="/dentists"
            element={
              <ProtectedRoute requiredRole="customer">
                <DentistList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dentists/:dentistId"
            element={
              <ProtectedRoute requiredRole="customer">
                <DentistDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/appointments/new/:dentistId"
            element={
              <ProtectedRoute requiredRole="customer">
                <AppointmentForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/appointments"
            element={
              <ProtectedRoute requiredRole="customer">
                <PatientAppointments />
              </ProtectedRoute>
            }
          />

          {/* Dentist Protected Routes */}
          <Route
            path="/patients"
            element={
              <ProtectedRoute requiredRole="doctor">
                <DentistAppointments />
              </ProtectedRoute>
            }
          />

          {/* Common Protected Routes */}
          <Route
            path="/appointments/:appointmentId"
            element={
              <ProtectedRoute>
                <AppointmentDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </BrowserRouter>
  );
};

export default App;
