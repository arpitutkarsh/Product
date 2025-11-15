import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/authContext.jsx";
import axios from "axios";
import { FaHome, FaPlus, FaThList, FaSignOutAlt } from "react-icons/fa";

const SideBar = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) =>
    location.pathname === path
      ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg"
      : "text-gray-700 hover:bg-gray-100";

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:8000/api/ver1/admin/logout",
        {},
        { withCredentials: true }
      );
      logout();
      navigate("/");
      alert("👋 Logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
      alert(error.response?.data?.message || "Failed to logout");
    }
  };

  return (
    <div className="fixed top-0 left-0 w-72 h-screen bg-white border-r shadow-lg p-6 flex flex-col justify-between overflow-hidden z-50">
      {/* Floating bubbles */}
      <div className="absolute w-36 h-36 bg-pink-400 rounded-full opacity-30 top-[-50px] left-[-50px] animate-diagonalSlow"></div>
      <div className="absolute w-48 h-48 bg-pink-300 rounded-full opacity-20 bottom-[-80px] right-[-60px] animate-diagonalSlowReverse"></div>
      <div className="absolute w-24 h-24 bg-pink-500 rounded-full opacity-25 top-[150px] right-[50px] animate-diagonalSlow"></div>

      {/* Floating stars */}
      <div className="absolute w-2 h-2 bg-yellow-400 rounded-full top-[40px] left-[60px] animate-twinkleDiagonal"></div>
      <div className="absolute w-1.5 h-1.5 bg-yellow-300 rounded-full top-[120px] right-[100px] animate-twinkleDiagonalReverse"></div>
      <div className="absolute w-2 h-2 bg-yellow-500 rounded-full bottom-[150px] left-[80px] animate-twinkleDiagonal"></div>
      <div className="absolute w-1.5 h-1.5 bg-yellow-400 rounded-full bottom-[50px] right-[40px] animate-twinkleDiagonalReverse"></div>

      {/* Small floating particles for starry effect */}
      {Array.from({ length: 15 }).map((_, i) => (
        <div
          key={i}
          className={`absolute w-1 h-1 bg-white rounded-full opacity-70 animate-particle${i % 3}`}
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
        ></div>
      ))}

      {/* Sidebar content */}
      <div className="relative z-10 flex flex-col justify-between h-full">
        <div>
          <h2 className="text-2xl font-extrabold text-blue-600 mb-10 tracking-wide text-center">
            Admin Panel
          </h2>

          <nav className="flex flex-col space-y-3">
            <Link
              to="/home"
              className={`flex items-center p-3 rounded-lg font-medium transition ${isActive("/home")}`}
            >
              <FaHome className="mr-3" /> Dashboard
            </Link>

            <Link
              to="/add-product"
              className={`flex items-center p-3 rounded-lg font-medium transition ${isActive("/add-product")}`}
            >
              <FaPlus className="mr-3" /> Add Product
            </Link>

            <Link
              to="/add-category"
              className={`flex items-center p-3 rounded-lg font-medium transition ${isActive("/add-category")}`}
            >
              <FaThList className="mr-3" /> Add Category
            </Link>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center justify-center bg-red-500 text-white p-3 rounded-lg font-medium hover:bg-red-600 transition shadow-md"
        >
          <FaSignOutAlt className="mr-2" /> Logout
        </button>
      </div>

      {/* Tailwind animations */}
      <style>{`
        @keyframes diagonal {
          0% { transform: translate(0, 0); }
          50% { transform: translate(20px, 20px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes diagonalReverse {
          0% { transform: translate(0, 0); }
          50% { transform: translate(-20px, -20px); }
          100% { transform: translate(0, 0); }
        }
        .animate-diagonalSlow {
          animation: diagonal 8s infinite ease-in-out;
        }
        .animate-diagonalSlowReverse {
          animation: diagonalReverse 8s infinite ease-in-out;
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.3); }
        }
        .animate-twinkleDiagonal {
          animation: twinkle 4s infinite;
        }
        .animate-twinkleDiagonalReverse {
          animation: twinkle 5s infinite;
        }

        @keyframes particle1 {
          0% { transform: translateY(0px); opacity: 0.5; }
          50% { transform: translateY(-8px); opacity: 1; }
          100% { transform: translateY(0px); opacity: 0.5; }
        }
        @keyframes particle2 {
          0% { transform: translateX(0px); opacity: 0.4; }
          50% { transform: translateX(6px); opacity: 0.9; }
          100% { transform: translateX(0px); opacity: 0.4; }
        }
        @keyframes particle3 {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 0.5; }
          50% { transform: translate(4px, -4px) rotate(180deg); opacity: 1; }
          100% { transform: translate(0, 0) rotate(0deg); opacity: 0.5; }
        }
        .animate-particle0 { animation: particle1 6s infinite ease-in-out; }
        .animate-particle1 { animation: particle2 5s infinite ease-in-out; }
        .animate-particle2 { animation: particle3 7s infinite ease-in-out; }
      `}</style>
    </div>
  );
};

export default SideBar;
