import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { logout } from "../../services/authServices";

const PendingApproval = () => {
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
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md border border-gray-200 rounded-2xl p-8 shadow-sm text-center">

        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <img className="text-3xl" src="https://img.icons8.com/?size=100&id=64499&format=png&color=000000"/>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Under Review</h1>
        <p className="text-gray-500 text-sm mb-6">
          Your profile has been submitted successfully. Admin will review and approve your account shortly.
        </p>

        <button
          onClick={handleLogout}
          className="w-full border border-black text-black py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
        >
          Logout
        </button>

      </div>
    </div>
  );
};

export default PendingApproval;