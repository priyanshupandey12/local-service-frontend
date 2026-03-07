import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCustomerBookings } from "../../services/bookingService";
import { getMe } from "../../services/authServices";

const formatTime = (time) => {
  if (!time) return "Anytime";
  const [hours, minutes] = time.split(":").map(Number);
  const ampm = hours >= 12 ? "PM" : "AM";
  const h = hours % 12 || 12;
  return `${h}:${String(minutes).padStart(2, "0")} ${ampm}`;
};

const statusDot = {
  requested: "bg-yellow-400",
  confirmed: "bg-blue-400",
  "in-progress": "bg-purple-400",
  completed: "bg-green-400",
  cancelled: "bg-red-400",
};

const statusLabel = {
  requested: "Requested",
  confirmed: "Confirmed",
  "in-progress": "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsRes, profileRes] = await Promise.all([
          getCustomerBookings(),
          getMe(),
        ]);
        setBookings(bookingsRes.bookings);
        setProfile(profileRes.user);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const columns = [
    {
      title: "Pending",
      subtitle: "Awaiting confirmation",
      color: "border-t-yellow-400",
      badge: "bg-yellow-50 text-yellow-600",
      bookings: bookings.filter((b) => ["requested", "confirmed"].includes(b.status)),
    },
    {
      title: "Active",
      subtitle: "Work in progress",
      color: "border-t-purple-400",
      badge: "bg-purple-50 text-purple-600",
      bookings: bookings.filter((b) => b.status === "in-progress"),
    },
    {
      title: "Completed",
      subtitle: "Successfully done",
      color: "border-t-green-400",
      badge: "bg-green-50 text-green-600",
      bookings: bookings.filter((b) => b.status === "completed"),
    },
    {
      title: "Cancelled",
      subtitle: "Cancelled bookings",
      color: "border-t-red-400",
      badge: "bg-red-50 text-red-600",
      bookings: bookings.filter((b) => b.status === "cancelled"),
    },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-10">

       
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-gray-900">
              {getGreeting()}, {profile?.name?.split(" ")[0] || "there"} 👋
            </h1>
            <p className="text-gray-400 text-sm mt-0.5">
              {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/providers")}
              className="bg-black text-white text-sm px-5 py-2.5 rounded-xl hover:bg-gray-900 transition"
            >
              + Book Service
            </button>
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2">
              <div className="w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs font-black">
                {profile?.name?.charAt(0).toUpperCase() || "?"}
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">{profile?.name || "Loading..."}</p>
                <p className="text-xs text-gray-400">{profile?.email || ""}</p>
              </div>
            </div>
          </div>
        </div>

     
        <div className="grid grid-cols-4 gap-3 mb-8">
          {[
            { label: "Total", value: bookings.length, color: "text-gray-900", bg: "bg-white" },
            { label: "Pending", value: bookings.filter((b) => ["requested", "confirmed"].includes(b.status)).length, color: "text-yellow-600", bg: "bg-yellow-50" },
            { label: "Active", value: bookings.filter((b) => b.status === "in-progress").length, color: "text-purple-600", bg: "bg-purple-50" },
            { label: "Completed", value: bookings.filter((b) => b.status === "completed").length, color: "text-green-600", bg: "bg-green-50" },
          ].map((stat) => (
            <div key={stat.label} className={`${stat.bg} rounded-2xl border border-gray-100 p-4`}>
              <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

       
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {columns.map((col) => (
              <div key={col.title} className={`bg-white rounded-2xl border border-gray-100 border-t-4 ${col.color} overflow-hidden`}>

          
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-0.5">
                    <h2 className="text-sm font-bold text-gray-900">{col.title}</h2>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${col.badge}`}>
                      {col.bookings.length}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">{col.subtitle}</p>
                </div>

            
                <div className="p-3 space-y-2 min-h-40">
                  {col.bookings.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-xs text-gray-300">No bookings</p>
                    </div>
                  ) : (
                    <>
                      {col.bookings.slice(0, 3).map((booking) => (
                        <div
                          key={booking._id}
                          onClick={() => navigate(`/customer/bookings/${booking._id}`)}
                          className="bg-gray-50 rounded-xl p-3 cursor-pointer hover:bg-gray-100 hover:shadow-sm transition"
                        >
                       
                          <div className="flex items-center gap-1.5 mb-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${statusDot[booking.status]}`} />
                            <span className="text-xs text-gray-400">{statusLabel[booking.status]}</span>
                          </div>

                      
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                              {booking?.providerId?.name?.charAt(0).toUpperCase() || "?"}
                            </div>
                            <p className="text-sm font-bold text-gray-900 truncate">
                              {booking?.providerId?.name || "Unavailable"}
                            </p>
                          </div>

                          <p className="text-xs text-gray-500 mb-1 truncate">
                            {booking?.categoryId?.name || "N/A"}
                          </p>
                          <div className="flex items-center ">
                          <img src="https://img.icons8.com/?size=100&id=6OOnASO9fxuG&format=png&color=000000" className="h-3 w-3 mr-1"/>
                          <p className="text-xs text-gray-400 truncate"> {booking.address}</p>
                            </div>
                          <div className="mt-2 pt-2 border-t border-gray-200 flex items-center justify-between">
                            <p className="text-xs text-gray-400">
                              {new Date(booking.scheduledDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                            </p>
                            <p className="text-xs text-gray-400">{formatTime(booking.scheduledTime)}</p>
                          </div>
                        </div>
                      ))}

                   
                      {col.bookings.length > 3 && (
                        <button
                          onClick={() => navigate("/customer/bookings")}
                          className="w-full text-xs text-gray-400 hover:text-black py-2 text-center transition border-t border-gray-100 mt-1"
                        >
                          +{col.bookings.length - 3} more →
                        </button>
                      )}
                    </>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default CustomerDashboard;