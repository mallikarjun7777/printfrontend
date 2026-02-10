import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Marketplace = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: "", price: "", description: "" });
  const [interest, setInterest] = useState({});
  const [loading, setLoading] = useState(false);
  const [interestLoading, setInterestLoading] = useState({});
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  // Fetch all items except user's own
  const fetchItems = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/marketplace", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Add new item
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.price) return alert("Title and Price are required");

    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/marketplace", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm({ title: "", price: "", description: "" });
      fetchItems();
    } catch (err) {
      console.error(err);
      alert("Failed to add item");
    } finally {
      setLoading(false);
    }
  };

  // Express interest
  const handleInterest = async (itemId) => {
    const { bidAmount, contact } = interest[itemId] || {};
    if (!bidAmount || !contact) return alert("Please enter contact and bid");

    setInterestLoading((prev) => ({ ...prev, [itemId]: true }));

    try {
      await axios.post(
        `http://localhost:5000/api/marketplace/${itemId}/interested`,
        { bidAmount, contact },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Interest submitted successfully!");
      setInterest((prev) => ({ ...prev, [itemId]: { bidAmount: "", contact: "" } }));
    } catch (err) {
      console.error(err);
      alert("Failed to submit interest");
    } finally {
      setInterestLoading((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  // Delete item
  const handleDelete = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/marketplace/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems((prev) => prev.filter((item) => item._id !== itemId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete item");
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-6 max-w-5xl mx-auto pt-32">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-green-700">📚 Marketplace</h2>
          <button
            onClick={() => navigate("/marketplace/my-listings")}
            className="bg-yellow-500 text-white px-5 py-2 rounded-lg shadow hover:bg-yellow-600 transition"
          >
            My Listings
          </button>
        </div>

        {/* Add new item form */}
        <form className="mb-8 p-6 bg-white rounded-lg shadow space-y-4" onSubmit={handleSubmit}>
          <h3 className="text-2xl font-semibold text-gray-800">List Your Calculator/Book</h3>
          <input
            type="text"
            placeholder="Item Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none placeholder-gray-400 text-gray-800"
            required
          />
          <input
            type="number"
            placeholder="Price (₹)"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none placeholder-gray-400 text-gray-800"
            required
          />
          <textarea
            placeholder="Description (optional)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none placeholder-gray-400 text-gray-800"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700 transition"
          >
            {loading ? "Adding..." : "Add Item"}
          </button>
        </form>

        {/* Available items */}
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Available Items</h3>
        {items.length === 0 ? (
          <p className="text-gray-600">No items listed yet.</p>
        ) : (
          <ul className="space-y-6">
            {items.map((item) => {
              const isOwner = item.user?._id === userId;
              return (
                <li key={item._id} className="bg-white p-6 rounded-lg shadow-md space-y-3 border border-gray-200">
                  <p className="font-bold text-gray-900 text-lg">{item.title}</p>
                  <p className="text-green-700 font-semibold">₹{item.price}</p>
                  <p className="text-gray-700">{item.description}</p>
                  <p className="text-sm text-gray-500">Listed by: {item.user?.name || "Unknown"}</p>

                  {/* Non-owner can express interest */}
                  {!isOwner && (
                    <div className="mt-3 space-y-2">
                      <input
                        type="text"
                        placeholder="Your Contact Details"
                        value={interest[item._id]?.contact || ""}
                        onChange={(e) =>
                          setInterest((prev) => ({
                            ...prev,
                            [item._id]: { ...prev[item._id], contact: e.target.value },
                          }))
                        }
                        className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none placeholder-gray-500 text-gray-800"
                      />
                      <input
                        type="number"
                        placeholder="Bid Amount (₹)"
                        value={interest[item._id]?.bidAmount || ""}
                        onChange={(e) =>
                          setInterest((prev) => ({
                            ...prev,
                            [item._id]: { ...prev[item._id], bidAmount: e.target.value },
                          }))
                        }
                        className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none placeholder-gray-500 text-gray-800"
                      />
                      <button
                        onClick={() => handleInterest(item._id)}
                        disabled={interestLoading[item._id]}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                      >
                        {interestLoading[item._id] ? "Submitting..." : "Interested"}
                      </button>
                    </div>
                  )}

                  {/* Owner options */}
                  {isOwner && (
                    <div className="flex justify-between items-center mt-3">
                      <p className="text-sm text-gray-500 italic">You own this item. Bidding disabled.</p>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
