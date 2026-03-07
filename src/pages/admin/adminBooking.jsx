import { useState, useEffect } from "react";
import { getAllBookings } from "../../services/adminService";

const statusColors = {
  requested: "bg-yellow-50 text-yellow-600",
  confirmed: "bg-blue-50 text-blue-600",
  "in-progress": "bg-purple-50 text-purple-600",
  completed: "bg-green-50 text-green-600",
  cancelled: "bg-red-50 text-red-600",
};

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await getAllBookings();
        setBookings(response.bookings);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const filtered = bookings.filter(
    (b) =>
      b.customerId.name.toLowerCase().includes(search.toLowerCase()) ||
      b.providerId.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
     
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
        <p className="text-gray-500 text-sm mt-1">Overview of all platform bookings</p>
      </div>

    
      <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by customer or provider name..."
          className="w-full text-sm outline-none text-gray-700 placeholder-gray-400"
        />
      </div>

  
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
    
        <div className="grid grid-cols-6 px-6 py-3 border-b border-gray-100 bg-gray-50">
          <p className="text-xs font-semibold text-gray-500 uppercase">Customer</p>
          <p className="text-xs font-semibold text-gray-500 uppercase">Provider</p>
          <p className="text-xs font-semibold text-gray-500 uppercase">Category</p>
          <p className="text-xs font-semibold text-gray-500 uppercase">Date</p>
          <p className="text-xs font-semibold text-gray-500 uppercase">Time</p>
          <p className="text-xs font-semibold text-gray-500 uppercase text-right">Status</p>
        </div>

      
        {loading ? (
          <div className="text-center text-gray-400 py-10">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-gray-400 py-10">No bookings found</div>
        ) : (
          filtered?.map((booking) => (
            <div
              key={booking._id}
              className="grid grid-cols-6 px-6 py-4 border-b border-gray-100 items-center hover:bg-gray-50 transition"
            >
              <p className="text-sm text-gray-900">{booking?.customerId?.name}</p>
              <p className="text-sm text-gray-900">{booking?.providerId?.name}</p>
              <p className="text-sm text-gray-600">{booking?.categoryId?.name}</p>
              <p className="text-sm text-gray-600">
                {new Date(booking.scheduledDate).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600">{booking.scheduledTime}</p>
              <div className="flex justify-end">
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColors[booking.status]}`}>
                  {booking.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default AdminBookings;