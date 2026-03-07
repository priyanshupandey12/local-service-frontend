import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getStats } from "../../services/adminService";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getStats();
        setStats(response.stats);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: "Total Customers", value: stats?.totalCustomers, path: null },
    { label: "Total Providers", value: stats?.totalProviders, path: "/admin/providers" },
    { label: "Pending Approvals", value: stats?.pendingApprovals, path: "/admin/providers" },
    { label: "Total Reviews", value: stats?.totalReviews, path: "/admin/reviews" },
    { label: "Total Bookings", value: stats?.totalBookings, path: null },
  ];

  return (
    <div>
   
    <div className="mb-8 flex items-center justify-between">
  <div>
    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
    <p className="text-gray-500 text-sm mt-1">Welcome to the admin panel</p>
  </div>
  <button
    onClick={() => navigate("/")}
    className="border border-gray-300 text-gray-600 text-sm px-4 py-2 rounded-lg hover:bg-gray-50 transition"
  >
    ← Go to Home
  </button>
</div>

   
      {loading ? (
        <div className="text-center text-gray-400 py-10">Loading...</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map((card) => (
            <div
              key={card.label}
              onClick={() => card.path && navigate(card.path)}
              className={`border border-gray-200 bg-white rounded-xl p-5 hover:border-black hover:shadow-sm transition ${card.path ? "cursor-pointer" : ""}`}
            >
              <p className="text-xs text-gray-500 mb-1">{card.label}</p>
              <p className="text-3xl font-bold text-gray-900">{card.value ?? 0}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;