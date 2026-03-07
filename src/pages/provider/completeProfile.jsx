import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createProviderProfile } from "../../services/providerService";
import { getPublicCategories } from "../../services/categoryService";

const CompleteProfile = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    bio: "",
    category: "",
    city: "",
    area: "",
    phone: "",
    basePrice: "",
  });
  const [profilePhoto, setProfilePhoto] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getPublicCategories();
        setCategories(response.categories);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const selectedCategory = categories.find((c) => c._id === formData.category);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = new FormData();
      data.append("bio", formData.bio);
      data.append("category", formData.category);
      data.append("city", formData.city);
      data.append("area", formData.area);
      data.append("phone", formData.phone);
      if (formData.basePrice) data.append("basePrice", formData.basePrice);
      if (profilePhoto) data.append("profilePhoto", profilePhoto);

      await createProviderProfile(data);
      navigate("/provider/pending-approval");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md border border-gray-200 rounded-2xl p-8 shadow-sm">

        <h1 className="text-2xl font-bold text-gray-900 mb-1">Complete Your Profile</h1>
        <p className="text-gray-500 text-sm mb-6">Fill in your details to get approved</p>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell customers about your experience..."
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-black transition resize-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-black transition"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-black transition"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>

        
          {selectedCategory && (
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Your Price <span className="text-gray-400">(optional)</span>
              </label>

           
              <div className="bg-gray-50 rounded-lg px-4 py-2 mb-2 flex items-center justify-between">
                <p className="text-xs text-gray-500">Category base price</p>
                <p className="text-xs font-bold text-gray-900">₹{selectedCategory.basePrice}</p>
              </div>

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">₹</span>
                <input
                  type="number"
                  name="basePrice"
                  value={formData.basePrice}
                  onChange={handleChange}
                  placeholder={`Min ₹${selectedCategory.basePrice}`}
                  min={selectedCategory.basePrice}
                  className="w-full border border-gray-300 rounded-lg pl-7 pr-4 py-2.5 text-sm outline-none focus:border-black transition"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Leave empty to use category default (₹{selectedCategory.basePrice})
              </p>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Enter your city"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-black transition"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Area</label>
            <input
              type="text"
              name="area"
              value={formData.area}
              onChange={handleChange}
              placeholder="Enter your area"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-black transition"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Profile Photo <span className="text-gray-400">(optional)</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProfilePhoto(e.target.files[0])}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-black transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-900 transition disabled:opacity-50"
          >
            {loading ? "Please wait..." : "Submit Profile"}
          </button>
        </form>

      </div>
    </div>
  );
};

export default CompleteProfile;