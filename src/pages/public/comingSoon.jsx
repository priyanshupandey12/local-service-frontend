import { useSearchParams, useNavigate } from "react-router-dom";

const ComingSoon = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const service = searchParams.get("service");

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="text-5xl mb-6">🚧</p>
        <h1 className="text-2xl font-black text-gray-900 mb-2">Coming Soon</h1>
        <p className="text-gray-500 text-sm mb-2">
          <span className="font-semibold text-gray-900">"{service}"</span> is not available yet.
        </p>
        <p className="text-gray-400 text-sm mb-8">
          We're working on bringing more services to your area. Check back soon!
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate("/providers")}
            className="bg-black text-white text-sm px-6 py-2.5 rounded-xl hover:bg-gray-900 transition"
          >
            Browse Categories
          </button>
          <button
            onClick={() => navigate("/")}
            className="border border-gray-200 text-gray-600 text-sm px-6 py-2.5 rounded-xl hover:bg-gray-50 transition"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;