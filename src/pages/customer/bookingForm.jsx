import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProviderById } from "../../services/providerService";
import { createBooking } from "../../services/bookingService";

const BookingForm = () => {
  const { providerId } = useParams();
  const navigate = useNavigate();

  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    address: "",
    scheduledDate: "",
    scheduledTime: "",
    problemDescription: "",
  });
  const [customerImage, setCustomerImage] = useState(null);
  const isFormValid =
  formData.address.trim() &&
  formData.scheduledDate &&
  formData.problemDescription.trim();

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const response = await getProviderById(providerId);
        setProvider(response.profile);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProvider();
  }, [providerId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const data = new FormData();
      data.append("providerId", provider.userId._id);
      data.append("categoryId", provider.category._id);
      data.append("address", formData.address);
      data.append("scheduledDate", formData.scheduledDate);
      data.append("scheduledTime", formData.scheduledTime);
      data.append("problemDescription", formData.problemDescription);
      if (customerImage) data.append("customerImage", customerImage);

      await createBooking(data);
      navigate("/customer/bookings");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const getMinTime = () => {
  if (!formData.scheduledDate) return "";
  const today = new Date().toISOString().split("T")[0];
  if (formData.scheduledDate === today) {
    const oneHourLater = new Date(Date.now() + 60 * 60 * 1000);
    return `${String(oneHourLater.getHours()).padStart(2, "0")}:${String(oneHourLater.getMinutes()).padStart(2, "0")}`;
  }
  return "";
};

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>;
  if (!provider) return <div className="min-h-screen flex items-center justify-center text-gray-400">Provider not found</div>;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto px-4 py-10">

        <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-black mb-6 flex items-center gap-1">
          ← Back
        </button>

       
        <div className="border border-gray-200 rounded-2xl p-5 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">{provider.userId.name}</h2>
              <p className="text-xs text-gray-500 mt-0.5">{provider.category.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{provider.city}, {provider.area}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900">₹{provider.category.basePrice}</p>
              <p className="text-xs text-gray-400">base price</p>
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">Book Service</h1>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your address"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-black transition"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Date</label>
            <input
              type="date"
              name="scheduledDate"
              value={formData.scheduledDate}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-black transition"
            />
          </div>

        <div>
  <label className="text-sm font-medium text-gray-700 block mb-1">
    Time <span className="text-gray-400">(optional)</span>
  </label>
  <input
    type="time"
    name="scheduledTime"
    value={formData.scheduledTime}
    onChange={handleChange}
    min={getMinTime()}
    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-black transition"
  />
</div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Problem Description</label>
            <textarea
              name="problemDescription"
              value={formData.problemDescription}
              onChange={handleChange}
              placeholder="Describe your problem..."
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-black transition resize-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Image <span className="text-gray-400">(optional)</span></label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCustomerImage(e.target.files[0])}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={submitting || !isFormValid}
            className="w-full bg-black text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Please wait..." : "Confirm Booking"}
          </button>
        </form>

      </div>
    </div>
  );
};

export default BookingForm;