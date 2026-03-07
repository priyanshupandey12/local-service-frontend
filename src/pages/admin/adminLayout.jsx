import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../../services/authServices";
import useAuthStore from "../../store/authStore";

const navItems = [
  { label: "Dashboard", path: "/admin/dashboard" },
  { label: "Providers", path: "/admin/providers" },
  { label: "Categories", path: "/admin/categories" },
    { label: "Bookings", path: "/admin/bookings" },
  { label: "Reviews", path: "/admin/reviews" },
];

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const { clearAuth } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
      clearAuth();
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">

   
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col fixed h-full">

       
        <div className="px-6 py-5 border-b border-gray-200">
          <h1 className="text-sm font-bold text-gray-900">Admin Panel</h1>
          <p className="text-xs text-gray-400 mt-0.5">Management Console</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                  isActive
                    ? "bg-black text-white font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

       
        <div className="px-3 py-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            Logout
          </button>
        </div>

      </aside>

     
      <main className="ml-56 flex-1 p-8">
        {children}
      </main>

    </div>
  );
};

export default AdminLayout;