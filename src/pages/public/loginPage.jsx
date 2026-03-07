import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../../services/authServices";
import useAuthStore from "../../store/authStore";

const Login = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
      const isFormValid = formData.email.trim() && formData.password.trim().length >= 8;
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await login(formData);
      setAuth(response.userId, response.role, response.token);

      if (response.role === "provider") {
        navigate("/provider/dashboard");
      } else if (response.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/providers");
      }
    } catch (err) {
    

       if (err.response?.status === 429) {
      setError("Too many login attempts. Please try again later.");
    } else {
      setError(err.response?.data?.message || "Something went wrong");
    }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md border border-gray-200 rounded-2xl p-8 shadow-sm">

        <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome Back</h1>
        <p className="text-gray-500 text-sm mb-6">Login to your account</p>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-black transition"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-black transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !isFormValid}
            className="w-full bg-black text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-900 transition  disabled:cursor-not-allowed"
          >
            {loading ? "Please wait..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link to="/register" className="text-black font-medium hover:underline">
            Register
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;