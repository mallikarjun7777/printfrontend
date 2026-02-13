import React, { useEffect, useState } from "react";
import axios from "axios";

const MyListings = () => {
  const [myItems, setMyItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState({});
  const token = localStorage.getItem("token");

  // initial fetch moved into useEffect to avoid dependency warnings

  const handleDelete = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    setDeleting((prev) => ({ ...prev, [itemId]: true }));
    try {
      await axios.delete(`https://printbackend.onrender.com/api/marketplace/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyItems((prev) => prev.filter((item) => item._id !== itemId));
      alert("Item deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete item");
    } finally {
      setDeleting((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          "https://printbackend.onrender.com/api/marketplace/my-listings",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (mounted) setMyItems(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch your listings");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-6 max-w-5xl mx-auto pt-32">
        <h2 className="text-3xl font-bold mb-6 text-blue-800">📋 My Listings</h2>

        {loading ? (
          <p className="text-gray-700">Loading your listings...</p>
        ) : myItems.length === 0 ? (
          <p className="text-gray-700">You have not listed any items yet.</p>
        ) : (
          <ul className="space-y-6">
            {myItems.map((item) => (
              <li
                key={item._id}
                className="bg-white p-6 rounded-xl shadow-lg border border-gray-300 relative hover:shadow-2xl transition"
              >
                <p className="font-bold text-gray-900 text-lg">{item.title}</p>
                <p className="text-green-800 font-semibold">₹{item.price}</p>
                <p className="text-gray-800">{item.description}</p>

                {/* Delete button */}
                <button
                  onClick={() => handleDelete(item._id)}
                  disabled={deleting[item._id]}
                  className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700 transition"
                >
                  {deleting[item._id] ? "Deleting..." : "Delete"}
                </button>

                <h4 className="font-semibold text-gray-900 mt-4 mb-3 text-lg">
                  Interested Users:
                </h4>

                {item.interests.length === 0 ? (
                  <p className="text-gray-600 italic">No users have expressed interest yet.</p>
                ) : (
                  <ul className="space-y-4">
                    {item.interests.map((interest) => (
                      <li
                        key={interest._id}
                        className="border p-4 rounded-lg bg-blue-50 shadow-md"
                      >
                        <p className="text-gray-900">
                          <span className="font-semibold">Name:</span>{" "}
                          {interest.user?.name || "Unknown"}
                        </p>
                        <p className="text-gray-900">
                          <span className="font-semibold">Email:</span>{" "}
                          {interest.user?.email || "N/A"}
                        </p>
                        <p className="text-gray-900">
                          <span className="font-semibold">Contact:</span>{" "}
                          {interest.contact || "N/A"}
                        </p>
                        <p className="text-gray-900">
                          <span className="font-semibold">Bid Amount:</span> ₹
                          {Number(interest.bidAmount).toFixed(2)}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MyListings;

