import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCustomerBookings } from "../../services/bookingService";

const statusColors = {
  requested: "bg-yellow-50 text-yellow-600",
  confirmed: "bg-blue-50 text-blue-600",
  "in-progress": "bg-purple-50 text-purple-600",
  completed: "bg-green-50 text-green-600",
  cancelled: "bg-red-50 text-red-600",
};

const borderColors = {
  requested: "border-l-yellow-400",
  confirmed: "border-l-blue-400",
  "in-progress": "border-l-purple-400",
  completed: "border-l-green-400",
  cancelled: "border-l-red-400",
};

const tabs = ["all", "requested", "confirmed", "in-progress", "completed", "cancelled"];

const formatTime = (time) => {
  if (!time) return "Anytime";
  const [hours, minutes] = time.split(":").map(Number);
  const ampm = hours >= 12 ? "PM" : "AM";
  const h = hours % 12 || 12;
  return `${h}:${String(minutes).padStart(2, "0")} ${ampm}`;
};

const MyBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
 

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await getCustomerBookings();
        setBookings(response.bookings);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const filtered = activeTab === "all" ? bookings : bookings.filter((b) => b.status === activeTab);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-10">

    
        <div className="mb-6">
          <h1 className="text-2xl font-black text-gray-900">My Bookings</h1>
          <p className="text-gray-400 text-sm mt-0.5">{bookings.length} total bookings</p>
        </div>

  
        <div className="flex gap-2 mb-6 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition ${
                activeTab === tab
                  ? "bg-black text-white"
                  : "bg-white text-gray-500 border border-gray-200 hover:border-black"
              }`}
            >
              {tab === "all" ? `All (${bookings.length})` : tab}
            </button>
          ))}
        </div>

     
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-gray-400 py-10 bg-white rounded-2xl border border-gray-100">
            No bookings found
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((booking) => (
              <div
                key={booking._id}
                onClick={() => navigate(`/customer/bookings/${booking._id}`)}
                className={`bg-white rounded-2xl border border-gray-100 border-l-4 ${borderColors[booking.status]} p-5 cursor-pointer hover:shadow-md transition`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
               
                    <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {booking?.providerId?.name?.charAt(0).toUpperCase() || "*"}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">
                        {booking?.providerId?.name || "Service Provider Unavailable"}
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {booking?.categoryId?.name || "N/A"} · {booking.address}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(booking.scheduledDate).toLocaleDateString()} · {formatTime(booking.scheduledTime)}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 ${statusColors[booking.status]}`}>
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default MyBookings;