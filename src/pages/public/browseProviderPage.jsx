import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getPublicCategories } from "../../services/categoryService";
import LazyImage from "../../utils/lazyloading";

const defaultImage =
  "https://images.pexels.com/photos/4107120/pexels-photo-4107120.jpeg?auto=compress&cs=tinysrgb&w=400";

const BrowseProviders = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");


  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

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


  const filtered = useMemo(
    () =>
      categories.filter((c) =>
        c.name.toLowerCase().includes(debouncedSearch.toLowerCase())
      ),
    [categories, debouncedSearch]
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Browse Services</h1>
          <p className="text-gray-500 text-sm mt-1">
            Select a category to find professionals near you
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-3 mb-8 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search a service..."
            className="flex-1 text-sm outline-none text-gray-700 placeholder-gray-400"
          />
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-10">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-gray-400 py-10">
            No categories found
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filtered.map((category) => (
              <div
                key={category._id}
                onClick={() =>
                  navigate(`/providers/category/${category.name}`)
                }
                className="cursor-pointer group border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md hover:border-gray-300 transition-[box-shadow,border-color] duration-200"
              >
                <div className="relative h-52 overflow-hidden">
             
                  <LazyImage
                    src={category.image || defaultImage}
                    alt={category.name}
                    className="transition-transform duration-200 ease-out group-hover:scale-105 will-change-transform"
                  />
                </div>

                <div className="p-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                    {category.name}
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {category.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseProviders;