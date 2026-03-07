import { useState, useEffect } from "react";
import { useNavigate ,useSearchParams} from "react-router-dom";
import { getPublicCategories } from "../../services/categoryService";
import HowItWorks from "../../components/ui/howitWorks";
import Footer from "../../components/ui/footer";
import Video from "../../assets/video.mp4";





const Home = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [service, setService] = useState("");
  const [searchError, setSearchError] = useState(false);
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);
 

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getPublicCategories();
        setCategories(response.categories);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

const handleSearch = (e) => {
  e.preventDefault();
  if (!service.trim()) {
    setSearchError(true);
    return;
  }
  setSearchError(false);


  const matchedCategory = categories.find((c) =>
    c.name.toLowerCase().includes(service.trim().toLowerCase())
  );

  if (!matchedCategory) {
   
    navigate(`/coming-soon?service=${service.trim()}`);
    return;
  }

  const params = new URLSearchParams();
  if (location.trim()) params.append("location", location.trim());
  const query = params.toString();
  navigate(`/providers/category/${matchedCategory.name}${query ? `?${query}` : ""}`);
};

const handleCategoryClick = (categoryName) => {
  navigate(`/providers/category/${categoryName}`); 
};

  return (
    <div className="min-h-screen bg-white">

  
      <section className="bg-gray-50 px-6 py-16">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-12">
          <div className="flex-1 max-w-lg">
            <h1 className="text-5xl font-black text-gray-900 leading-tight mb-4">
              Reliable local <br />
              help for <span className="text-gray-400">every</span> <br />
              <span>task.</span>
            </h1>
            <p className="text-gray-500 text-sm leading-relaxed mb-8">
              Connect with top-rated plumbers, electricians, and cleaners in your neighborhood. Quality service guaranteed with upfront pricing.
            </p>
            <form onSubmit={handleSearch} className="flex items-center bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-6">
              <div className="flex items-center gap-2 flex-1 px-4 py-3 border-r border-gray-200">
                <img src="https://img.icons8.com/?size=100&id=3159&format=png&color=000000" className="w-4 h-4 text-gray-400" alt="Search icon"/>
                <input
                  type="text"
                  value={service}
                     onChange={(e) => { setService(e.target.value); setSearchError(false); }}
                  
                  placeholder="What service do you need?"
                  className="flex-1 text-sm outline-none text-gray-700 placeholder-gray-400"
                />
              </div>
              <div className="flex items-center gap-2 flex-1 px-4 py-3">
                <img src="https://img.icons8.com/?size=100&id=15989&format=png&color=000000" className="w-4 h-4 text-gray-400" alt="Location icon"/>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Your location"
                  className="flex-1 text-sm outline-none text-gray-700 placeholder-gray-400"
                />
              </div>
              <button type="submit" className="bg-black text-white text-sm font-medium px-6 py-3 hover:bg-gray-900 transition">
                Find Pro
              </button>
            </form>

            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                <img src="https://img.icons8.com/?size=100&id=bOXN3AZhMCek&format=png&color=000000" className="w-8 h-8 rounded-full border-2 border-white" />
                <img src="https://img.icons8.com/?size=100&id=23239&format=png&color=000000" className="w-8 h-8 rounded-full border-2 border-white" />
                <img src="https://img.icons8.com/?size=100&id=23309&format=png&color=000000" className="w-8 h-8 rounded-full border-2 border-white" />
                <div className="w-8 h-8 rounded-full border-2 border-white bg-black text-white text-xs flex items-center justify-center font-bold">4.9+</div>
              </div>
              <p className="text-sm text-gray-500">Top rated in your area right now</p>
            </div>
          </div>

<div className="flex-1 max-w-lg relative group">

  <div className="relative rounded-3xl overflow-hidden shadow-xl transition-all duration-500 group-hover:shadow-2xl">


    <video
      autoPlay
      loop
      muted
      preload="auto"
      playsInline
      className="w-full h-[420px] object-cover transition-transform duration-500 group-hover:scale-105"
    >
      <source src={Video} type="video/mp4" />
    </video>


    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300"></div>


    <div className="absolute bottom-10 left-8 text-white space-y-2">

      <p className="opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition duration-500 delay-100 text-lg font-semibold">
        Need Help At Home?
      </p>

      <p className="opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition duration-500 delay-300 text-sm">
        Find Trusted Professionals Nearby
      </p>

      <p className="opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition duration-500 delay-500 text-sm">
        Transparent Pricing
      </p>

      <p className="opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition duration-500 delay-700 text-sm">
        Fast Booking Experience
      </p>

    </div>

  </div>

</div>
        </div>
      </section>

    
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Popular Categories</h2>
            <p className="text-gray-500 text-sm mt-1">The most requested services in your area.</p>
          </div>
          <button onClick={() => navigate("/providers")} className="text-sm text-black font-medium hover:underline">
            View all →
          </button>
        </div>
        {loading ? (
          <div className="text-center text-gray-400 py-10">Loading categories...</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.slice(0, 4).map((category) => (
              <div key={category._id} onClick={() => handleCategoryClick(category.name)} className="cursor-pointer group">
                <div className="relative rounded-2xl overflow-hidden h-52 mb-3">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-300" />
                  <div className="absolute bottom-3 left-3">
                    <p className="text-white text-sm font-bold">{category.name}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{category.description}</p>
              </div>
              
            ))}
          </div>
        )}
      </section>

      


      <section className="bg-gray-50 px-6 py-16">
        <div className="max-w-6xl mx-auto flex items-center gap-16">
          <div className="flex-1 grid grid-cols-2 gap-3">
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="w-8 h-8 border border-gray-200 rounded-lg flex items-center justify-center mb-3"><span className="text-sm">🛡️</span></div>
              <h3 className="text-sm font-bold text-gray-900 mb-1">Vetted Pros</h3>
              <p className="text-xs text-gray-500 leading-relaxed">Every professional goes through a multi-step background check.</p>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="w-8 h-8 border border-gray-200 rounded-lg flex items-center justify-center mb-3"><span className="text-sm">🎧</span></div>
              <h3 className="text-sm font-bold text-gray-900 mb-1">24/7 Support</h3>
              <p className="text-xs text-gray-500 leading-relaxed">Real humans are here to help you every step of the way.</p>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="w-8 h-8 border border-gray-200 rounded-lg flex items-center justify-center mb-3"><span className="text-sm">💰</span></div>
              <h3 className="text-sm font-bold text-gray-900 mb-1">Upfront Pricing</h3>
              <p className="text-xs text-gray-500 leading-relaxed">Know exactly what you'll pay before the job even starts.</p>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="w-8 h-8 border border-gray-200 rounded-lg flex items-center justify-center mb-3"><span className="text-sm">✅</span></div>
              <h3 className="text-sm font-bold text-gray-900 mb-1">Quality Guarantee</h3>
              <p className="text-xs text-gray-500 leading-relaxed">Not happy? We'll make it right at no extra cost to you.</p>
            </div>
          </div>
          <div className="flex-1 max-w-md">
            <h2 className="text-4xl font-black text-gray-900 leading-tight mb-4">The smarter way to maintain your home.</h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-8">Stop spending hours searching for reliable help. We've done the hard work of vetting the best professionals in your area so you can focus on what matters.</p>
            <div className="space-y-4">
              {[
                { title: "Transparent scheduling", desc: "Book a pro in as little as 60 seconds." },
                { title: "Trusted professionals", desc: "Only vetted and verified professionals are available." },
                
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-black flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs">✓</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      <HowItWorks />


      <Footer />

    </div>
  );
};

export default Home;