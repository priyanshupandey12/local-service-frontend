import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProviderBookings } from "../../services/bookingService";
import { toggleAvailability, getProviderProfile, updateProviderProfile } from "../../services/providerService";

const formatTime = (time) => {
  if (!time) return "";
  const [hours, minutes] = time.split(":").map(Number);
  const ampm = hours >= 12 ? "PM" : "AM";
  const h = hours % 12 || 12;
  return `${h}:${String(minutes).padStart(2, "0")} ${ampm}`;
};

const ProviderDashboardV3 = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [isAvailable, setIsAvailable] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [error, setError] = useState("");


  const [showEditModal, setShowEditModal] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState("");
  const [editForm, setEditForm] = useState({
    bio: "",
    city: "",
    area: "",
    phone: "",
    basePrice: "",
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsRes, profileRes] = await Promise.all([
          getProviderBookings(),
          getProviderProfile(),
        ]);
        setBookings(bookingsRes.bookings);
        setIsAvailable(profileRes.profile.isAvailable);
        setProfile(profileRes.profile);

       
        setEditForm({
          bio: profileRes.profile.bio || "",
          city: profileRes.profile.city || "",
          area: profileRes.profile.area || "",
          phone: profileRes.profile.phone || "",
          basePrice: profileRes.profile.basePrice || "",

        });
        setPhotoPreview(profileRes.profile.profilePhoto || null);

      } catch (err) {
        setError(err?.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleToggle = async () => {
    if (!profile?.isApproved) {
      setError("Admin has not approved your profile yet. Please wait.");
      return;
    }
    setError("");
    setToggling(true);
    try {
      const response = await toggleAvailability();
      setIsAvailable(response.isAvailable);
    } catch (err) {
      console.error(err);
    } finally {
      setToggling(false);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditError("");
    setEditSuccess("");
    setEditLoading(true);
    try {
      const data = new FormData();
      data.append("bio", editForm.bio);
      data.append("city", editForm.city);
      data.append("area", editForm.area);
      data.append("phone", editForm.phone);
      data.append("basePrice", editForm.basePrice);
      if (profilePhoto) data.append("profilePhoto", profilePhoto);

     const response = await updateProviderProfile(data);
     setProfile((prev) => ({ ...prev, ...response.profile }));
       if (response.priceChanged) {
        setEditSuccess("Price change submitted — pending admin approval. You will be unavailable until approved.");
          } else {
                setEditSuccess("Profile updated successfully!");
              }
      setTimeout(() => {
        setShowEditModal(false);
        setEditSuccess("");
      }, 1000);
    } catch (err) {
      setEditError(err.response?.data?.message || "Something went wrong");
    } finally {
      setEditLoading(false);
    }
  };

  const columns = [
    {
      title: "Pending",
      color: "border-t-yellow-400",
      badge: "bg-yellow-50 text-yellow-600",
      bookings: bookings.filter((b) => ["requested", "confirmed"].includes(b.status)),
    },
    {
      title: "Active",
      color: "border-t-purple-400",
      badge: "bg-purple-50 text-purple-600",
      bookings: bookings.filter((b) => b.status === "in-progress"),
    },
    {
      title: "Done",
      color: "border-t-green-400",
      badge: "bg-green-50 text-green-600",
      bookings: bookings.filter((b) => ["completed", "cancelled"].includes(b.status)),
    },
  ];

  const statusLabel = {
    requested: "Requested",
    confirmed: "Confirmed",
    "in-progress": "In Progress",
    completed: "Completed",
    cancelled: "Cancelled",
  };

  const statusDot = {
    requested: "bg-yellow-400",
    confirmed: "bg-blue-400",
    "in-progress": "bg-purple-400",
    completed: "bg-green-400",
    cancelled: "bg-red-400",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-10">

  
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Provider Dashboard</h1>
            <p className="text-gray-400 text-sm mt-0.5">{bookings.length} total bookings</p>
          </div>

          <div className="flex items-center gap-3">

       
            <button
              onClick={() => setShowEditModal(true)}
              className="flex items-center gap-2 bg-white border border-gray-200 rounded-2xl px-4 py-2.5 text-sm font-medium text-gray-700 hover:border-black transition"
            >
               Edit Profile
            </button>

      
            <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-2xl px-4 py-2.5">
              <div className={`w-2 h-2 rounded-full ${isAvailable ? "bg-green-400" : "bg-gray-300"}`} />
              <span className="text-sm font-medium text-gray-700">{isAvailable ? "Available" : "Unavailable"}</span>
              <button
                onClick={handleToggle}
                disabled={toggling || !profile?.isApproved}
                className={`w-10 h-5 rounded-full transition-colors duration-200 ${isAvailable ? "bg-black" : "bg-gray-200"}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 mx-0.5 ${isAvailable ? "translate-x-5" : "translate-x-0"}`} />
              </button>
            </div>

          </div>
        </div>

        {error && <p className="text-red-500 text-xs mb-4">{error}</p>}

    
        {loading ? (
          <div className="text-center text-gray-400 py-10">Loading...</div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {columns.map((col) => (
              <div key={col.title} className={`bg-white rounded-2xl border border-gray-100 border-t-4 ${col.color} overflow-hidden`}>
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="text-sm font-bold text-gray-900">{col.title}</h2>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${col.badge}`}>
                    {col.bookings.length}
                  </span>
                </div>

                <div className="p-3 space-y-2 min-h-32">
                  {col.bookings.length === 0 ? (
                    <p className="text-xs text-gray-300 text-center py-6">No bookings</p>
                  ) : (
                    col.bookings.map((booking) => (
                      <div
                        key={booking._id}
                        onClick={() => navigate(`/provider/jobs/${booking._id}`)}
                        className="bg-gray-50 rounded-xl p-3 cursor-pointer hover:bg-gray-100 transition"
                      >
                        <div className="flex items-center gap-1.5 mb-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${statusDot[booking.status]}`} />
                          <span className="text-xs text-gray-400 capitalize">{statusLabel[booking.status]}</span>
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {booking.customerId?.name?.charAt(0).toUpperCase() || "?"}
                          </div>
                          <p className="text-sm font-semibold text-gray-900 truncate">{booking?.customerId?.name}</p>
                        </div>

                        <p className="text-xs text-gray-500 mb-1">{booking?.categoryId?.name || "N/A"}</p>
                        <p className="text-xs text-gray-400 truncate">{booking.address}</p>

                        <div className="mt-2 pt-2 border-t border-gray-200">
                          <p className="text-xs text-gray-400">
                            {new Date(booking.scheduledDate).toLocaleDateString()} · {formatTime(booking.scheduledTime)}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

  
      {showEditModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          onClick={() => setShowEditModal(false)}
        >
          <div
            className="bg-white rounded-3xl w-full max-w-md p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
          
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-gray-900">Edit Profile</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 transition"
              >✕</button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">

          
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                  {photoPreview ? (
                    <img src={photoPreview} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl">👤</div>
                  )}
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1">Profile Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="text-xs text-gray-500"
                  />
                </div>
              </div>

         
              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">Bio</label>
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  placeholder="Tell customers about yourself..."
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-black transition resize-none"
                />
              </div>

          
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1">City</label>
                  <input
                    type="text"
                    value={editForm.city}
                    onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                    placeholder="City"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-black transition"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1">Area</label>
                  <input
                    type="text"
                    value={editForm.area}
                    onChange={(e) => setEditForm({ ...editForm, area: e.target.value })}
                    placeholder="Area"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-black transition"
                  />
                </div>
              </div>

       
              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">Phone</label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  placeholder="10 digit phone number"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-black transition"
                />
              </div>

              <div>
             <label className="text-xs font-medium text-gray-700 block mb-1">
    Your Price <span className="text-gray-400">(optional)</span>
             </label>
            <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">₹</span>
               <input
                type="number"
                 value={editForm.basePrice}
                onChange={(e) => setEditForm({ ...editForm, basePrice: e.target.value })}
                  placeholder="Enter your price"
                  className="w-full border border-gray-200 rounded-xl pl-7 pr-3 py-2 text-sm outline-none focus:border-black transition"
                       />
                       </div>
                     {editForm.basePrice && editForm.basePrice !== String(profile?.basePrice) && (
                     <div className="mt-2 bg-yellow-50 border border-yellow-100 rounded-xl px-3 py-2">
                         <p className="text-xs text-yellow-700"> Price change requires admin approval — you will be set to pending</p>
                           </div>
                       )}
                         </div>


              {editError && <p className="text-red-500 text-xs">{editError}</p>}
              {editSuccess && <p className="text-green-600 text-xs">{editSuccess}</p>}

              <button
                type="submit"
                disabled={editLoading}
                className="w-full bg-black text-white py-2.5 rounded-xl text-sm font-medium hover:bg-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editLoading ? "Saving..." : "Save Changes"}
              </button>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProviderDashboardV3;