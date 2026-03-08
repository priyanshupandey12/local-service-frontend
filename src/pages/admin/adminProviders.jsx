import { useState, useEffect } from "react";
import { getProviders, approveProvider,deleteProvider } from "../../services/adminService";
import { getPublicCategories } from "../../services/categoryService";

const AdminProviders = () => {
  const [providers, setProviders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");



  useEffect(() => {
    fetchProviders();
    fetchCategories();
  }, []);

  const fetchProviders = async () => {
    try {
      const response = await getProviders();
      setProviders(response.providers);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getPublicCategories();
      setCategories(response.categories);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApprove = async (id, isApproved) => {
    setActionLoading(id);
    try {
      await approveProvider(id, { isApproved });
      setProviders((prev) =>
        prev.map((p) =>
          p._id === id
            ? { ...p, isApproved, status: isApproved ? "approved" : "rejected" }
            : p
        )
      );
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteProvider = async (providerId) => {
  if (!window.confirm("Are you sure? This will delete all bookings and reviews of this provider.")) return;
  
  try {
    await deleteProvider(providerId);
    setProviders(providers.filter((p) => p._id !== providerId));
  } catch (err) {
    setError(err.response?.data?.message || "Something went wrong");
  }
};

  const filtered = providers.filter((p) => {
    const matchesSearch =
      p?.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      p?.userId?.email?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory
      ? p?.category?.name === selectedCategory
      : true;
    const matchesStatus = selectedStatus ? p.status === selectedStatus : true;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const pendingCount = providers.filter((p) => p.status === "pending").length;
  const rejectedCount = providers.filter((p) => p.status === "rejected").length;

  const statusColors = {
    pending: "bg-yellow-50 text-yellow-600",
    approved: "bg-green-50 text-green-600",
    rejected: "bg-red-50 text-red-600",
  };

  return (
    <div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Provider Approvals</h1>
        <p className="text-gray-500 text-sm mt-1">Review and approve service provider applications</p>
      </div>

  
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="border border-gray-200 bg-white rounded-xl p-5">
          <p className="text-xs text-gray-500 mb-1">Pending Applications</p>
          <p className="text-3xl font-bold text-gray-900">{pendingCount}</p>
        </div>
        <div className="border border-gray-200 bg-white rounded-xl p-5">
          <p className="text-xs text-gray-500 mb-1">Rejected Applications</p>
          <p className="text-3xl font-bold text-gray-900">{rejectedCount}</p>
        </div>
      </div>

   
      <div className="flex gap-3 mb-6">
        <div className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full text-sm outline-none text-gray-700 placeholder-gray-400"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border border-gray-200 bg-white rounded-xl px-4 py-3 text-sm outline-none focus:border-black transition"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.name}>{cat.name}</option>
          ))}
        </select>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="border border-gray-200 bg-white rounded-xl px-4 py-3 text-sm outline-none focus:border-black transition"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>


      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
     
        <div className="grid grid-cols-6 px-6 py-3 border-b border-gray-100 bg-gray-50">
          <p className="text-xs font-semibold text-gray-500 uppercase col-span-2">Provider Name</p>
          <p className="text-xs font-semibold text-gray-500 uppercase">Category</p>
            <p className="text-xs font-semibold text-gray-500 uppercase">Price</p>
          <p className="text-xs font-semibold text-gray-500 uppercase">Status</p>
          
          <p className="text-xs font-semibold text-gray-500 uppercase text-right">Actions</p>
        </div>

      
        {loading ? (
          <div className="text-center text-gray-400 py-10">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-gray-400 py-10">No providers found</div>
        ) : (
          filtered.map((provider) => (
            <div
              key={provider._id}
              className="grid grid-cols-6 px-6 py-4 border-b border-gray-100 items-center hover:bg-gray-50 transition"
            >
            
              <div className="col-span-2">
                <p className="text-sm font-medium text-gray-900">{provider?.userId?.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{provider?.userId?.email}</p>
              </div>

          
              <span className="text-xs px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full font-medium w-fit">
                {provider?.category?.name}
              </span>

                <div>
    <p className="text-sm font-medium text-gray-900">
      ₹{provider.basePrice || provider.category?.basePrice || "N/A"}
    </p>
    {provider.basePrice && provider.basePrice !== provider.category?.basePrice && (
      <p className="text-xs text-gray-400">
        Default: ₹{provider.category?.basePrice}
      </p>
    )}
  </div>

         
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium w-fit ${statusColors[provider.status]}`}>
                {provider?.status}
              </span>

              
              <div className="flex items-center justify-end gap-2">
                {provider?.status !== "approved" && (
                  <button
                    onClick={() => handleApprove(provider._id, true)}
                    disabled={actionLoading === provider._id}
                    className="bg-black text-white text-xs px-4 py-1.5 rounded-lg hover:bg-gray-900 transition disabled:opacity-50"
                  >
                    Approve
                  </button>
                )}
                {provider.status !== "rejected" && (
                  <button
                    onClick={() => handleApprove(provider._id, false)}
                    disabled={actionLoading === provider._id}
                    className="border border-gray-300 text-gray-600 text-xs px-4 py-1.5 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
                  >
                    Reject
                  </button>
                )}
                <button
                    onClick={() => handleDeleteProvider(provider._id)}
                     className="text-xs text-red-500 hover:text-red-700 transition"
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

export default AdminProviders;