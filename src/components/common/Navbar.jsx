import { useNavigate, Link } from "react-router-dom";
import { logout } from "../../services/authServices";
import useAuthStore from "../../store/authStore";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, role, clearAuth } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
      clearAuth();
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  const getDashboardPath = () => {
    if (role === "customer") return "/customer/dashboard";
    if (role === "provider") return "/provider/dashboard";
    if (role === "admin") return "/admin/dashboard";
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-40">
      <div className="max-w-5xl mx-auto flex items-center justify-between">

     
        <Link to="/" className="text-lg font-bold text-gray-900">
          Servify
        </Link>

      
        <div className="flex items-center gap-6">
          <Link to="/" className="text-sm text-gray-600 hover:text-black transition">
            Home
          </Link>
          <Link to="/providers" className="text-sm text-gray-600 hover:text-black transition">
            Browse Services
          </Link>
        </div>

  
        <div className="flex items-center gap-3">
          {!isAuthenticated ? (
            <>
              <button
                onClick={() => navigate("/login")}
                className="text-sm text-gray-600 hover:text-black transition"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="bg-black text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-900 transition"
              >
                Register
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate(getDashboardPath())}
                className="text-sm text-gray-600 hover:text-black transition"
              >
                Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="bg-black text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-900 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;