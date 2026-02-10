import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const UserRegister = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/users/register", form);
      alert("Registration successful! Please login.");
      navigate("/user/login");
    } catch (err) {
      setError(err.response?.data?.message || "Error occurred");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 via-white to-blue-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-lg shadow-2xl rounded-2xl p-8 border border-gray-100">
        {/* Title */}
        <h2 className="text-3xl font-extrabold text-center text-blue-700 mb-2">
          Create Account ✨
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Register to get started with your account
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Full Name
            </label>
            <input
              name="name"
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm 
                         focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition
                         placeholder-gray-600 text-gray-800"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm 
                         focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition
                         placeholder-gray-600 text-gray-800"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Password
            </label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm 
                         focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition
                         placeholder-gray-600 text-gray-800"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold shadow-md hover:bg-blue-700 active:scale-95 transition-transform"
          >
            Register
          </button>
        </form>

        {/* Error Message */}
        {error && (
          <p className="mt-4 text-center text-red-600 bg-red-50 border border-red-200 py-2 rounded-lg">
            {error}
          </p>
        )}

        {/* Footer Links */}
        <div className="mt-6 flex justify-center text-sm text-gray-500">
          <Link to="/user/login" className="hover:text-blue-600 transition">
            Already have an account? Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserRegister;
