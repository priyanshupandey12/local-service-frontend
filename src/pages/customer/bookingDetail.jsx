import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBookingById, cancelBooking, rescheduleBooking } from "../../services/bookingService";
import { createReview } from "../../services/reviewService";

const statusColors = {
  requested: "bg-yellow-50 text-yellow-600",
  confirmed: "bg-blue-50 text-blue-600",
  "in-progress": "bg-purple-50 text-purple-600",
  completed: "bg-green-50 text-green-600",
  cancelled: "bg-red-50 text-red-600",
};

const formatTime = (time) => {
  if (!time) return "Anytime during the day";
  const [hours, minutes] = time.split(":").map(Number);
  const ampm = hours >= 12 ? "PM" : "AM";
  const h = hours % 12 || 12;
  return `${h}:${String(minutes).padStart(2, "0")} ${ampm}`;
};

const BookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const [showReschedule, setShowReschedule] = useState(false);
const [modalImage, setModalImage] = useState(null);
  const [rescheduleData, setRescheduleData] = useState({
    scheduledDate: "",
    scheduledTime: "",
  });

  const [review, setReview] = useState({
    providerId: "",
    bookingId: "",
    rating: "",
    comment: "",
  });

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await getBookingById(id);
        const b = response.booking;
        setBooking(b);

        setReview((prev) => ({
          ...prev,
          providerId: b?.providerId?._id,
          bookingId: b._id,
        }));

        if (b.status === "completed") {
          setAlreadyReviewed(b.isReviewed || false);
        }

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id]);

  const handleCancel = async () => {
    setError("");
    setActionLoading(true);
    try {
      const response = await cancelBooking(id);
      setBooking(response.booking);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReschedule = async (e) => {
    e.preventDefault();
    setError("");
    setActionLoading(true);
    try {
      const response = await rescheduleBooking(id, rescheduleData);
      setBooking(response.booking);
      setShowReschedule(false);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    setError("");
    setActionLoading(true);
    try {
      await createReview(review);
      setReviewSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>;
  if (!booking) return <div className="min-h-screen flex items-center justify-center text-gray-400">Booking not found</div>;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 py-10">

        <button onClick={() => navigate("/customer/bookings")} className="text-sm text-gray-500 hover:text-black mb-6 flex items-center gap-1">
          ← Back to My Bookings
        </button>

       
        <div className="border border-gray-200 rounded-2xl p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-900">Booking Detail</h1>
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColors[booking.status]}`}>
              {booking.status}
            </span>
          </div>
<div className="space-y-3">


  <div className="grid grid-cols-2 gap-3">
    <div className="bg-gray-50 rounded-xl p-3">
      <p className="text-xs text-gray-400 mb-0.5">Provider</p>
      <p className="text-sm font-semibold text-gray-900">
        {booking?.providerId?.name || "Service Provider Unavailable"}
      </p>
    </div>
    <div className="bg-gray-50 rounded-xl p-3">
      <p className="text-xs text-gray-400 mb-0.5">Category</p>
      <p className="text-sm font-semibold text-gray-900">
        {booking?.categoryId?.name || "N/A"}
      </p>
    </div>
  </div>


  <div className="grid grid-cols-2 gap-3">
    <div className="bg-gray-50 rounded-xl p-3">
      <p className="text-xs text-gray-400 mb-0.5">Date</p>
      <p className="text-sm font-semibold text-gray-900">
        {new Date(booking.scheduledDate).toLocaleDateString()}
      </p>
    </div>
    <div className="bg-gray-50 rounded-xl p-3">
      <p className="text-xs text-gray-400 mb-0.5">Time</p>
      <p className="text-sm font-semibold text-gray-900">
        {formatTime(booking.scheduledTime)}
      </p>
    </div>
  </div>


  <div className="bg-gray-50 rounded-xl p-3">
    <p className="text-xs text-gray-400 mb-0.5"> Address</p>
    <p className="text-sm font-semibold text-gray-900">{booking.address}</p>
  </div>


  <div className="bg-gray-50 rounded-xl p-3">
    <p className="text-xs text-gray-400 mb-0.5">Problem Description</p>
    <p className="text-sm text-gray-700">{booking.problemDescription}</p>
  </div>

{booking?.customerImage && (
  <div className="bg-gray-50 rounded-xl p-3">
    <p className="text-xs text-gray-400 mb-2">Customer Image</p>
    <img
      src={booking.customerImage}
      alt="customer"
      onClick={() => setModalImage(booking.customerImage)}
      className="w-full max-h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition"
    />
  </div>
)}

{modalImage && (
  <div
    className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4"
    onClick={() => setModalImage(null)}
  >
    <div className="relative max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
      <img
        src={modalImage}
        alt="full view"
        className="w-full max-h-screen object-contain rounded-2xl"
      />
      <button
        onClick={() => setModalImage(null)}
        className="absolute top-3 right-3 w-8 h-8 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-black transition"
      >✕</button>
    </div>
  </div>
)}


  {booking.jobNotes && (
    <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
      <p className="text-xs text-blue-400 mb-0.5">Job Notes</p>
      <p className="text-sm text-blue-800">{booking.jobNotes}</p>
    </div>
  )}

</div>

       
          {booking.providerPhone && ["confirmed", "in-progress"].includes(booking.status) && (
            <div className="flex items-center gap-3 mt-4 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
              <span className="text-green-600 text-lg">📞</span>
              <div>
                <p className="text-xs text-green-600 font-medium">Provider Contact</p>
                
                 <a href={`tel:${booking.providerPhone}`}
                  className="text-sm font-bold text-green-700 hover:underline"
                >
                  {booking.providerPhone}
                </a>
              </div>
            </div>
          )}

   
          {booking.status === "completed" && (
            <div className="mt-4 space-y-3">
              {booking.beforeImages?.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Before Images:</p>
                  <div className="flex gap-2 flex-wrap">
                    {booking.beforeImages.map((img, i) => (
                      <img key={i} src={img} alt="before" className="w-24 h-24 object-cover rounded-lg" />
                    ))}
                  </div>
                </div>
              )}
              {booking.afterImages?.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">After Images:</p>
                  <div className="flex gap-2 flex-wrap">
                    {booking.afterImages.map((img, i) => (
                      <img key={i} src={img} alt="after" className="w-24 h-24 object-cover rounded-lg" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

     
        {["requested", "confirmed"].includes(booking.status) && (
          <div className="flex gap-3 mb-6">
            <button onClick={handleCancel} disabled={actionLoading}
              className="flex-1 border border-black text-black py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed">
              Cancel Booking
            </button>
            <button onClick={() => setShowReschedule(!showReschedule)}
              className="flex-1 bg-black text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-900 transition">
              {showReschedule ? "Cancel" : "Reschedule"}
            </button>
          </div>
        )}

     
        {showReschedule && (
          <form onSubmit={handleReschedule} className="border border-gray-200 rounded-2xl p-6 mb-6 space-y-4">
            <h2 className="text-sm font-bold text-gray-900">Reschedule Booking</h2>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">New Date</label>
              <input type="date"
                value={rescheduleData.scheduledDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setRescheduleData({ ...rescheduleData, scheduledDate: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-black transition"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                New Time <span className="text-gray-400">(optional)</span>
              </label>
              <input type="time"
                value={rescheduleData.scheduledTime}
                onChange={(e) => setRescheduleData({ ...rescheduleData, scheduledTime: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-black transition"
              />
            </div>
            <button type="submit" disabled={actionLoading || !rescheduleData.scheduledDate}
              className="w-full bg-black text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed">
              {actionLoading ? "Please wait..." : "Confirm Reschedule"}
            </button>
          </form>
        )}

     
        {booking.status === "completed" && !reviewSubmitted && !alreadyReviewed && (
          <form onSubmit={handleReview} className="border border-gray-200 rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-bold text-gray-900">Leave a Review</h2>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Rating</label>
              <select value={review.rating}
                onChange={(e) => setReview({ ...review, rating: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-black transition">
                <option value="">Select rating</option>
                {[1, 2, 3, 4, 5].map((r) => (
                  <option key={r} value={r}>{"⭐".repeat(r)} {r}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Comment</label>
              <textarea value={review.comment}
                onChange={(e) => setReview({ ...review, comment: e.target.value })}
                placeholder="Share your experience..."
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-black transition resize-none"
              />
            </div>
            <button type="submit" disabled={actionLoading || !review.rating}
              className="w-full bg-black text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed">
              {actionLoading ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        )}

        {(reviewSubmitted || alreadyReviewed) && (
          <div className="bg-yellow-50 border border-yellow-100 text-yellow-700 text-sm px-4 py-3 rounded-lg">
            ⏳ Review submitted — pending admin approval
          </div>
        )}

      </div>
    </div>
    
  );
};

export default BookingDetail;