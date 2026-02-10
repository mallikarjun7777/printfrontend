import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const UserLogin = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/login",
        form
      );
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("name", res.data.name);
      localStorage.setItem("role", "user");
      navigate("/user/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 via-white to-blue-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-lg shadow-2xl rounded-2xl p-8 border border-gray-100">
        {/* Title */}
        <h2 className="text-3xl font-extrabold text-center text-blue-700 mb-2">
          Welcome Back 👋
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Please login to your account
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
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
              value={form.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
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
            Login
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
          <Link to="/user/register" className="hover:text-blue-600 transition">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
