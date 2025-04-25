import React, { useState } from "react";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Use the same event name we defined in the Navbar component
const AUTH_CHANGE_EVENT = "authStateChange";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmpassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const handleLoginData = async (e) => {
    e.preventDefault();
    setLoginLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        { email, password }
      );

      if (response.status === 200) {
        // Store token and user data in localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        // Dispatch auth change event to inform other components
        window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));

        toast.success("Login Successful!");
        navigate("/dashboard");
      } else {
        toast.error(response.data.message || "Login Failed. Please Try Again");
      }
    } catch (error) {
      console.error("Login Error", error);
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSignupData = async (e) => {
    e.preventDefault();
    setSignupLoading(true);

    if (password.length < 6 || confirmPassword.length < 6) {
      toast.info("Password must be above 6 Characters");
      setSignupLoading(false);
      return;
    }

    if (confirmPassword !== password) {
      toast.info("Confirm Password doesn't match with Password");
      setSignupLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/signup",
        {
          username,
          email,
          password,
          role,
        }
      );

      if (response.status === 200) {
        toast.success("Signup Successful!");
        navigate("/login");
      } else {
        toast.error(
          response.data.message || "Signup Failed. Please Try Again Later"
        );
      }
    } catch (error) {
      console.error("Signup Error", error);
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-200 via-gray-100 to-gray-300">
      <div
        className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 transform transition-all duration-500"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(229,231,235,1) 100%)",
        }}
      >
        <div className="flex justify-center mb-6">
          <button
            className={`px-4 py-2 text-lg font-semibold cursor-pointer ${
              isLogin ? "text-white bg-gray-600" : "text-gray-600"
            } rounded-l-lg transition-all duration-300`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`px-4 py-2 text-lg font-semibold cursor-pointer ${
              !isLogin ? "text-white bg-gray-600" : "text-gray-600"
            } rounded-r-lg transition-all duration-300`}
            onClick={() => setIsLogin(false)}
          >
            Signup
          </button>
        </div>
        <div>
          {isLogin ? (
            <form className="space-y-4" onSubmit={handleLoginData}>
              <div className="flex items-center border-b border-gray-300 py-2">
                <FaEnvelope className="text-gray-500 mr-3" />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full focus:outline-none"
                  required
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </div>
              <div className="flex items-center border-b border-gray-300 py-2">
                <FaLock className="text-gray-500 mr-3" />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full focus:outline-none"
                  required
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              </div>
              <button
                type="submit"
                className="w-full cursor-pointer bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition-all duration-300"
                disabled={loginLoading}
              >
                {loginLoading ? "Logging in..." : "Login"}
              </button>
            </form>
          ) : (
            <form className="space-y-4" onSubmit={handleSignupData}>
              <div className="flex items-center border-b border-gray-300 py-2">
                <FaUser className="text-gray-500 mr-3" />
                <input
                  type="text"
                  placeholder="Username"
                  className="w-full focus:outline-none"
                  required
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                />
              </div>
              <div className="flex items-center border-b border-gray-300 py-2">
                <FaEnvelope className="text-gray-500 mr-3" />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full focus:outline-none"
                  required
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </div>
              <div className="flex items-center border-b border-gray-300 py-2">
                <select
                  className="w-full focus:outline-none cursor-pointer"
                  required
                  onChange={(e) => {
                    setRole(e.target.value);
                  }}
                >
                  <option value="" disabled selected>
                    Select Role
                  </option>
                  <option value="customer">Customer</option>
                  <option value="doctor">Doctor</option>
                </select>
              </div>
              <div className="flex items-center border-b border-gray-300 py-2">
                <FaLock className="text-gray-500 mr-3" />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full focus:outline-none"
                  required
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              </div>
              <div className="flex items-center border-b border-gray-300 py-2">
                <FaLock className="text-gray-500 mr-3" />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="w-full focus:outline-none"
                  required
                  onChange={(e) => {
                    setConfirmpassword(e.target.value);
                  }}
                />
              </div>
              <button
                type="submit"
                className="w-full cursor-pointer bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition-all duration-300"
                disabled={signupLoading}
              >
                {signupLoading ? "Signing up..." : "Signup"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
