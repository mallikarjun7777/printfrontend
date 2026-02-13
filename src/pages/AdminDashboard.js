import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [statusUpdate, setStatusUpdate] = useState({});
  const [updatingId, setUpdatingId] = useState(null);

  const token = localStorage.getItem('token');

  const fetchAllOrders = useCallback(async () => {
    try {
      const res = await axios.get('https://printbackend.onrender.com/api/orders/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch orders');
    }
  }, [token]);

  const updateStatus = async (id) => {
    if (!window.confirm('Are you sure you want to update the status?')) return;

    setUpdatingId(id);
    try {
      await axios.put(
        `https://printbackend.onrender.com/api/orders/update/${id}`,
        { status: statusUpdate[id] },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('Status updated');
      fetchAllOrders();
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [fetchAllOrders]);

  // Helper to render status badge
  const renderStatusBadge = (status) => {
    const colors = {
      Pending: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
      'In Progress': 'bg-blue-100 text-blue-800 border border-blue-300',
      Completed: 'bg-green-100 text-green-800 border border-green-300',
    };
    return (
      <span
        className={`px-3 py-1 text-sm font-medium rounded-full ${colors[status] || 'bg-gray-100 text-gray-800'}`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="p-8 max-w-5xl mx-auto bg-gradient-to-br from-gray-50 to-gray-100 shadow-xl rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Hello, {localStorage.getItem('name')} 👋 (Admin)
      </h2>

      <h3 className="text-xl font-semibold mb-4 text-gray-700">📑 All Print Orders</h3>

      {orders.length === 0 && (
        <p className="text-gray-600 italic">No print orders available.</p>
      )}

      <div className="grid gap-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-lg transition"
          >
            <div className="mb-2">
              <p className="text-gray-700">
                <strong>User:</strong> {order.userId.name}{' '}
                <span className="text-gray-500 text-sm">({order.userId.email})</span>
              </p>
            </div>

            <div className="mb-2">
              <p className="text-gray-700">
                <strong>File:</strong>{' '}
                <a
                  href={order.fileUrl}
                  className="text-blue-600 underline font-medium hover:text-blue-800"
                  target="_blank"
                  rel="noreferrer"
                >
                  View File
                </a>
              </p>
            </div>

            <div className="mb-4">
              <strong>Status:</strong> {renderStatusBadge(order.status)}
            </div>

            <div className="flex items-center space-x-3">
              <select
                value={statusUpdate[order._id] || order.status}
                onChange={(e) =>
                  setStatusUpdate({ ...statusUpdate, [order._id]: e.target.value })
                }
                className="border border-gray-300 text-gray-800 bg-white px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={updatingId === order._id}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>

              <button
                onClick={() => updateStatus(order._id)}
                disabled={updatingId === order._id}
                className={`px-4 py-2 rounded text-white font-medium shadow ${
                  updatingId === order._id
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700'
                } transition`}
              >
                {updatingId === order._id ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;

