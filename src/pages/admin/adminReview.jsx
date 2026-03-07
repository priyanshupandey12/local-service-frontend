import { useState, useEffect } from "react";
import { getAllReviews, toggleReviewVisibility,deleteReview } from "../../services/adminService";

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await getAllReviews();
      setReviews(response.reviews);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
  if (!window.confirm("Delete this review permanently?")) return;
  setActionLoading(id);
  try {
    await deleteReview(id);
    setReviews((prev) => prev.filter((r) => r._id !== id));
  } catch (err) {
    console.error(err);
  } finally {
    setActionLoading(null);
  }
};

  const handleToggle = async (id) => {
    setActionLoading(id);
    try {
      const response = await toggleReviewVisibility(id);
      setReviews((prev) =>
        prev.map((r) => (r._id === id ? { ...r, isVisible: response.review.isVisible } : r))
      );
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

const filtered = reviews.filter(
  (r) =>
    r?.customerId?.name?.toLowerCase().includes(search.toLowerCase()) ||
    r?.providerId?.name?.toLowerCase().includes(search.toLowerCase()) ||
    r?.comment?.toLowerCase().includes(search.toLowerCase())
);

  return (
    <div>
    
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Review Moderation</h1>
        <p className="text-gray-500 text-sm mt-1">Manage and moderate customer reviews</p>
      </div>

    
      <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by customer, provider or comment..."
          className="w-full text-sm outline-none text-gray-700 placeholder-gray-400"
        />
      </div>

  
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
     
        <div className="grid grid-cols-6 px-6 py-3 border-b border-gray-100 bg-gray-50">
          <p className="text-xs font-semibold text-gray-500 uppercase">Customer</p>
          <p className="text-xs font-semibold text-gray-500 uppercase">Provider</p>
          <p className="text-xs font-semibold text-gray-500 uppercase">Rating</p>
          <p className="text-xs font-semibold text-gray-500 uppercase col-span-2">Comment</p>
          <p className="text-xs font-semibold text-gray-500 uppercase text-right">Actions</p>
        </div>

      
        {loading ? (
          <div className="text-center text-gray-400 py-10">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-gray-400 py-10">No reviews found</div>
        ) : (
          filtered.map((review) => (
            <div
              key={review._id}
              className={`grid grid-cols-6 px-6 py-4 border-b border-gray-100 items-center hover:bg-gray-50 transition ${!review.isVisible ? "opacity-50" : ""}`}
            >
             
              <p className="text-sm text-gray-900">{review?.customerId?.name}</p>

             
              <p className="text-sm text-gray-900">{review?.providerId?.name}</p>

            
              <p className="text-sm text-gray-700">⭐ {review.rating}</p>

            
              <p className="text-sm text-gray-600 col-span-2 truncate">{review.comment}</p>

            
              <div className="flex justify-end">
                <button
                  onClick={() => handleToggle(review._id)}
                  disabled={actionLoading === review._id}
                  className={`text-xs px-4 py-1.5 rounded-lg transition disabled:opacity-50 ${
                    review.isVisible
                      ? "border border-red-200 text-red-500 hover:bg-red-50"
                      : "border border-gray-300 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {review.isVisible ? "Hide" : "Show"}
                </button>
                 <button
    onClick={() => handleDelete(review._id)}
    disabled={actionLoading === review._id}
    className="text-xs px-4 py-1.5 rounded-lg border border-red-300 bg-red-50 text-red-600 hover:bg-red-100 transition disabled:opacity-50"
  >
    Delete
  </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default AdminReviews;