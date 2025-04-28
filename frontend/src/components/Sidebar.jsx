// src/components/Sidebar.jsx
import { Home, Star } from "lucide-react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    // Optionally remove token and any other data you have stored
    toast.success("Logged out successfully");
    navigate("/signin");
  };

  return (
    <div className="w-64 bg-white border-r h-screen">
      <div className="p-4">
        {/* <a href="/" className="flex items-center gap-2 mb-6 cursor-pointer">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center ">
            <span className="text-white font-semibold">AI</span>
          </div>
          <span className="text-xl font-semibold">NoteWise</span>
        </a> */
        <a href="/" className="flex items-center gap-2 mb-6 cursor-pointer">
        <img 
          src="noteimage.png" 
          alt="Logo" 
          className="w-8 h-8 rounded-lg object-cover" 
        />
        <span className="text-xl font-semibold">NoteWise</span>
      </a>
        }




        <nav className="space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg text-gray-600 hover:bg-purple-50 hover:text-purple-600"
          >
            <Home size={20} />
            <span>Home</span>
          </Link>
          <Link
            to="/favorites"
            className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg text-gray-600 hover:bg-purple-50 hover:text-purple-600"
          >
            <Star size={20} />
            <span>Favorites</span>
          </Link>
        </nav>

        <button
          onClick={handleLogout}
          className="mt-4 w-full px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors duration-300"

        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
