import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../../services/authServices";
import useAuthStore from "../../store/authStore";

const Register = () => {
  const navigate = useNavigate();

  const { setAuth } = useAuthStore();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
    const isFormValid = formData.name.trim() && formData.email.trim() && formData.password.trim().length >= 8;
  const [error, setError] = useState("");
  const [loading, setLoading] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (role) => {
    setError("");
    setLoading(role);
try {
    const response = await register({ ...formData, role });
    setAuth(response.userId, response.role);
    if (role === "provider") {
      navigate("/provider/complete-profile");
    } else {
      navigate("/providers");
    }
  } catch (err) {
    if (err.response?.status === 429) {
      setError("Too many register attempts. Please try again later.");
    } else {
      setError(err.response?.data?.message || "Something went wrong");
    }
  } finally {
    setLoading("");
  }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md border border-gray-200 rounded-2xl p-8 shadow-sm">

        <h1 className="text-2xl font-bold text-gray-900 mb-1">Create Account</h1>
        <p className="text-gray-500 text-sm mb-6">Join us as a customer or service provider</p>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4 mb-6">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-black transition"
            />
          </div>

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
              placeholder="Minimum 8 characters"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-black transition"
            />
          </div>
        </div>

        <div className="space-y-3">
         <button
             onClick={() => handleSubmit("customer")}
               disabled={loading !== "" || !isFormValid}
              className="w-full bg-black text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                   {loading === "customer" ? "Please wait..." : "Register as Customer"}
                      </button>

                    <button
                     onClick={() => handleSubmit("provider")}
                     disabled={loading !== "" || !isFormValid}
                        className="w-full border border-black text-black py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                           >
                       {loading === "provider" ? "Please wait..." : "Register as Provider"}
                          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-black font-medium hover:underline">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;