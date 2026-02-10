import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/admin/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('name', res.data.name);
      localStorage.setItem('role', 'admin');
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid admin credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          🔐 Admin Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Admin Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 text-gray-800 placeholder-gray-500 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
          <input
            name="password"
            type="password"
            placeholder="Admin Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 text-gray-800 placeholder-gray-500 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
          <button
            type="submit"
            className="w-full bg-red-600 text-white py-3 rounded-lg font-medium shadow hover:bg-red-700 transition"
          >
            Login
          </button>
        </form>

        {error && (
          <p className="mt-4 text-red-600 text-center font-medium">{error}</p>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;
