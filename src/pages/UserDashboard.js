import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const [file, setFile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [aiData, setAiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileUpload = async () => {
    if (!file) {
      setError('Please select a PDF file.');
      return;
    }

    setLoading(true);
    setError('');
    setAiData(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Upload PDF and process AI in one call
      const res = await axios.post(
        'https://printbackend.onrender.com/api/files/processPdfAndUpload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { aiData: aiResponse } = res.data;

      // Refresh orders list
      await fetchOrders();

      // Set AI feedback
      setAiData(aiResponse || null);

      // Clear selected file
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          'Upload failed.'
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = useCallback(async () => {
    if (!token) {
      setError('User not authenticated. Please login.');
      return;
    }
    setLoadingOrders(true);
    try {
      const res = await axios.get('https://printbackend.onrender.com/api/orders/my-orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load orders.');
    } finally {
      setLoadingOrders(false);
    }
  }, [token]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <div className="min-h-screen bg-gray-100 pt-28 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-blue-800">
          Hello, {localStorage.getItem('name')} 👋
        </h2>

        {/* Marketplace Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/marketplace')}
            className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition shadow"
          >
            🛒 Go to Marketplace
          </button>
        </div>

        {/* Upload & Analyze */}
        <div className="mb-8 border-t pt-6">
          <h3 className="text-2xl font-semibold mb-3 text-blue-700">Upload & Analyze Document</h3>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={(e) => {
              setFile(e.target.files[0]);
              setError('');
              setAiData(null);
            }}
            className="w-full border border-gray-300 rounded px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
          <button
            onClick={handleFileUpload}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 shadow"
          >
            {loading ? 'Uploading & Processing...' : 'Upload & Analyze'}
          </button>
          {error && <p className="text-red-600 mt-2">{error}</p>}
        </div>

        {/* AI Feedback */}
        {aiData && (
          <div className="mb-8 p-6 bg-gray-50 border border-gray-300 rounded-xl shadow-inner space-y-4">
            <h3 className="text-xl font-bold text-blue-700 mb-3">AI Feedback</h3>
            <div>
              <h4 className="font-semibold text-gray-900">Summary:</h4>
              <p className="text-gray-800">{aiData.summary || 'No summary provided.'}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Clarity Suggestions:</h4>
              <p className="text-gray-800">{aiData.claritySuggestions || 'No suggestions provided.'}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Tags:</h4>
              {aiData.tags?.length ? (
                <ul className="list-disc list-inside text-gray-800">
                  {aiData.tags.map((tag, idx) => (
                    <li key={idx}>{tag}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-800">No tags provided.</p>
              )}
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Validation Feedback:</h4>
              <p className="text-gray-800">{aiData.validationFeedback || 'No validation feedback provided.'}</p>
            </div>
          </div>
        )}

        {/* Orders Section */}
        <h3 className="text-2xl font-semibold mb-4 text-blue-700">Your Orders 📦</h3>
        {loadingOrders ? (
          <p>Loading your orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-600">You have no orders yet.</p>
        ) : (
          <ul className="space-y-4">
            {orders.map((order) => (
              <li key={order._id} className="border p-4 rounded-xl bg-gray-50 shadow hover:shadow-lg transition">
                <p className="text-gray-900 font-medium">
                  📄 File: {order.originalName || 'Unnamed File'}
                </p>
                <a
                  href={order.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline"
                >
                  🔗 View File
                </a>
                <p>
                  <span className="font-medium">Status:</span>{' '}
                  <span className="text-green-700">{order.status}</span>
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;

