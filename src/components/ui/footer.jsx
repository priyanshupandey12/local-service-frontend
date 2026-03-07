import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 px-6 py-10">
      <div className="max-w-6xl mx-auto flex items-start justify-between gap-8">

     
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">LocalServices</h2>
          <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
            Connecting customers with trusted local professionals for every home service need.
          </p>
        </div>

  
        <div className="flex gap-16">
          <div>
            <p className="text-xs font-semibold text-gray-900 mb-3 uppercase">Company</p>
            <div className="space-y-2">
              <Link to="/" className="block text-xs text-gray-500 hover:text-black transition">Home</Link>
              <Link to="/providers" className="block text-xs text-gray-500 hover:text-black transition">Browse Services</Link>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-900 mb-3 uppercase">Account</p>
            <div className="space-y-2">
              <Link to="/login" className="block text-xs text-gray-500 hover:text-black transition">Login</Link>
              <Link to="/register" className="block text-xs text-gray-500 hover:text-black transition">Register</Link>
              <Link to="/register" className="block text-xs text-gray-500 hover:text-black transition">Become a Provider</Link>
            </div>
          </div>
        </div>

      </div>

      <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
        <p className="text-xs text-gray-400">© 2026 LocalServices. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;