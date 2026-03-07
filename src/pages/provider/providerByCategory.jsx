import { useState, useEffect } from "react";
import { useParams, useNavigate ,useSearchParams} from "react-router-dom";
import { getAllProviders } from "../../services/providerService";
import useAuthStore from "../../store/authStore";

const defaultImage = "https://images.pexels.com/photos/4107120/pexels-photo-4107120.jpeg?auto=compress&cs=tinysrgb&w=400";

const ProvidersByCategory = () => {
    const [searchParams] = useSearchParams();
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuthStore();

  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    location: searchParams.get("location") || "",
    minPrice: "",
    maxPrice: "",
    rating: "",
  });


  useEffect(() => {
    fetchProviders();
  }, [categoryName]);

  const fetchProviders = async (customFilters = filters) => {
    setLoading(true);
    try {
      const params = { category: categoryName };
      if (customFilters.location) params.location = customFilters.location;
      if (customFilters.minPrice) params.minPrice = customFilters.minPrice;
      if (customFilters.maxPrice) params.maxPrice = customFilters.maxPrice;
      if (customFilters.rating) params.rating = customFilters.rating;

      const response = await getAllProviders(params);
      setProviders(response.providers);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleApplyFilters = () => {
    fetchProviders(filters);
  };

  const handleResetFilters = () => {
    const reset = { city: "", area: "", minPrice: "", maxPrice: "", rating: "" };
    setFilters(reset);
    fetchProviders(reset);
  };

  const handleBookNow = (e, providerId) => {
    e.stopPropagation();
    if (!isAuthenticated) { navigate("/login"); return; }
    if (role !== "customer") return;
    navigate(`/customer/book/${providerId}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-10">

  
        <button onClick={() => navigate("/providers")} className="text-sm text-gray-500 hover:text-black mb-6 flex items-center gap-1">
          ← Back to Services
        </button>


        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">{categoryName} Professionals</h1>
          <p className="text-gray-500 text-sm mt-1">{providers.length} professional{providers.length !== 1 ? "s" : ""} available</p>
        </div>

        <div className="flex gap-8">

      
          <div className="w-70 flex-shrink-0">
            <div className="border border-gray-200 rounded-2xl p-5 sticky top-24 space-y-5">
              <h2 className="text-sm font-bold text-gray-900">Filters</h2>

          
             <div>
  <label className="text-xs font-medium text-gray-500 block mb-1.5">Location</label>
  <input
    type="text"
    name="location"
    value={filters.location}
    onChange={handleFilterChange}
    placeholder="City or Area"
    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-black transition"
  />
</div>

           
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1.5">Price Range (₹)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="minPrice"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    placeholder="Min"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-black transition"
                  />
                  <input
                    type="number"
                    name="maxPrice"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    placeholder="Max"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-black transition"
                  />
                </div>
              </div>

             
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1.5">Minimum Rating</label>
                <select
                  name="rating"
                  value={filters.rating}
                  onChange={handleFilterChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-black transition"
                >
                  <option value="">Any Rating</option>
                  <option value="1"> 1</option>
                  <option value="2"> 2</option>
                  <option value="3"> 3</option>
                  <option value="4"> 4</option>
                  <option value="5"> 5</option>
                </select>
              </div>

        
              <button
                onClick={handleApplyFilters}
                className="w-full bg-black text-white text-sm py-2.5 rounded-lg hover:bg-gray-900 transition"
              >
                Apply Filters
              </button>
              <button
                onClick={handleResetFilters}
                className="w-full border border-gray-200 text-gray-600 text-sm py-2.5 rounded-lg hover:bg-gray-50 transition"
              >
                Reset
              </button>
            </div>
          </div>

   
          <div className="flex-1">
            {loading ? (
              <div className="text-center text-gray-400 py-20">Loading providers...</div>
            ) : providers.length === 0 ? (
              <div className="text-center text-gray-400 py-20 border border-gray-200 rounded-2xl">
                <p className="text-lg mb-1">No providers found</p>
                <p className="text-sm">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {providers?.map((provider) => (
                  <div
                    key={provider._id}
                    onClick={() => navigate(`/providers/${provider._id}`)}
                    className="border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md hover:border-gray-300 transition cursor-pointer group"
                  >
                   
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={provider.profilePhoto || defaultImage}
                        alt={provider.userId?.name}
                        onError={(e) => e.target.src = defaultImage}
                        className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                      />
                  
                      <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-0.5 flex items-center gap-1 shadow-sm">
                        <span className="text-xs">⭐</span>
                        <span className="text-xs font-medium text-gray-700">
                          {provider.avgRating > 0 ? provider.avgRating : "New"}
                        </span>
                      </div>
                    </div>

                
                    <div className="p-4">
                      <h3 className="text-sm font-bold text-gray-900 mb-1">{provider?.userId?.name}</h3>
                      <p className="text-xs text-gray-500 mb-1 line-clamp-2">{provider?.bio}</p>
                      <p className="text-xs text-gray-400 mb-3">{provider.city}, {provider.area}</p>

                      <div className="flex items-center justify-between">
                     <div>
                      <p className="text-xs text-gray-400">Starting from</p>
                     <p className="text-sm font-bold text-gray-900">
                           ₹{provider.basePrice || provider.category?.basePrice}
                               </p>
                                </div>
                        <button
                          onClick={(e) => handleBookNow(e, provider._id)}
                           disabled={role === "provider" || role === "admin"}
                             title={role === "provider" ? "Login as customer to book" : ""}
                          className="bg-black text-white text-xs px-3 py-1.5 rounded-lg hover:bg-gray-900 transition disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProvidersByCategory;