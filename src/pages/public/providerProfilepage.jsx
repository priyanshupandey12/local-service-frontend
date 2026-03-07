import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProviderById } from "../../services/providerService";
import { getProviderReviews } from "../../services/reviewService";
import useAuthStore from "../../store/authStore";
import Map from "../../assets/map.png";

const defaultImage = "https://images.pexels.com/photos/4107120/pexels-photo-4107120.jpeg?auto=compress&cs=tinysrgb&w=600";

const ProviderProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuthStore();

  const [provider, setProvider] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const providerRes = await getProviderById(id);
        setProvider(providerRes.profile);
        const reviewsRes = await getProviderReviews(providerRes.profile.userId._id);
        setReviews(reviewsRes.reviews);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleBookNow = () => {
    if (!isAuthenticated) { navigate("/login"); return; }
    if (role !== "customer") return;
    navigate(`/customer/book/${id}`);
  };

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-base ${i < Math.round(rating) ? "text-yellow-400" : "text-gray-200"}`}>★</span>
    ));

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!provider) return (
    <div className="min-h-screen flex items-center justify-center text-gray-400">Provider not found</div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-10">

 
        <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-black mb-6 flex items-center gap-1">
          ← Back
        </button>

   
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden mb-4">
          <div className="flex">

      
            <div className="w-56 flex-shrink-0">
              <img
                src={provider.profilePhoto || defaultImage}
                alt={provider.userId?.name}
                onError={(e) => e.target.src = defaultImage}
                className="w-full h-full object-cover object-center"
                style={{ minHeight: "220px" }}
              />
            </div>

   
            <div className="flex-1 p-6 flex flex-col justify-between">
              <div>
         
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                  {provider.category?.name}
                </span>

          
                <h1 className="text-2xl font-black text-gray-900 mt-1 mb-1">
                  {provider.userId?.name}
                </h1>

           
                <p className="text-sm text-gray-500 mb-4">
                   {provider.city}, {provider.area}
                </p>

            
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-0.5">
                    {renderStars(provider.avgRating)}
                  </div>
                  <span className="text-sm font-bold text-gray-900">
                    {provider.avgRating > 0 ? provider.avgRating.toFixed(1) : "New"}
                  </span>
                </div>

            
                <p className="text-xs text-gray-400">
                  {provider.totalReviews} review{provider.totalReviews !== 1 ? "s" : ""}
                </p>
              </div>

      
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <div>
                      <p className="text-xs text-gray-400">Starting from</p>
                     <p className="text-sm font-bold text-gray-900">
                           ₹{provider.basePrice || provider.category?.basePrice}
                               </p>
                                </div>
                <button
                  onClick={handleBookNow}
                  disabled={role === "provider" || role === "admin"}
                    title={role === "provider" ? "Login as customer to book" : ""}
                  className="bg-black text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-gray-900 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Book Now
                </button>
              </div>
            </div>

          </div>
        </div>

  
        <div className="bg-white rounded-3xl border border-gray-100 p-6 mb-4">
          <div className="flex gap-8">

         
            <div className="flex-1">
              <h2 className="text-sm font-bold text-gray-900 mb-3">About</h2>
              {provider.bio ? (
                <p className="text-sm text-gray-600 leading-relaxed">{provider.bio}</p>
              ) : (
                <p className="text-sm text-gray-400">No bio added yet.</p>
              )}
            </div>

 
            <div className="w-px bg-gray-100" />

         
            <div className="w-44 flex-shrink-0">
              <h2 className="text-sm font-bold text-gray-900 mb-3">Location</h2>

        
<div className="w-full h-24 rounded-2xl overflow-hidden border border-gray-100 mb-3 relative">
  <img
    src={Map}
    alt="map"
    className="w-full h-full object-cover"
  />
 
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="bg-white rounded-full p-1.5 shadow-md">
      <div className="w-3 h-3 bg-blue-500 rounded-full" />
    </div>
  </div>
</div>

             
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
               
                  <p className="text-xs font-medium text-gray-700">{provider.city}</p>
                </div>
                <div className="flex items-center gap-2">
            
                  <p className="text-xs text-gray-500">{provider.area}</p>
                </div>
              </div>
            </div>

          </div>
        </div>

      
        <div className="bg-white rounded-3xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-bold text-gray-900">Customer Reviews</h2>
            <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
              {reviews.length} total
            </span>
          </div>

          {reviews.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-2xl mb-2">✨</p>
              <p className="text-sm font-medium text-gray-700">No reviews yet</p>
              <p className="text-xs text-gray-400 mt-1">Be the first to book and review</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review._id} className="border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                  
                      <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600 flex-shrink-0">
                        {review.customerId?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{review.customerId?.name}</p>
                        <div className="flex items-center gap-0.5 mt-0.5">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 flex-shrink-0">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed pl-12">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProviderProfile;