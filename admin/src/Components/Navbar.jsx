import React, { useState, useEffect } from "react";
import { UserCircle2, Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaHome, FaPlus, FaThList, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../Context/authContext.jsx";
import axiosInstance from "../utils/axiosInstance.js";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const menuItems = [
    { icon: <FaHome />, label: "Dashboard", path: "/home" },
    { icon: <FaPlus />, label: "Add Product", path: "/add-product" },
    { icon: <FaThList />, label: "Add Category", path: "/add-category" },
  ];

  const isActive = (path) =>
    location.pathname === path
      ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg"
      : "text-white hover:bg-white/20";

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/admin/logout");
      logout();
      navigate("/");
      alert("👋 Logged out successfully");
      setMenuOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
      alert(error.response?.data?.message || "Failed to logout");
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-600 to-pink-500 shadow-lg px-4 sm:px-8 py-4 flex justify-between items-center relative">
      <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-wide">
        Admin Dashboard
      </h1>

      {/* Desktop Right */}
      <div className="hidden md:flex items-center gap-4">
        <span className="text-white font-medium text-lg">Welcome, Admin</span>
        <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:scale-105 transition-transform cursor-pointer">
          <UserCircle2 className="w-7 h-7 text-purple-600" />
        </div>
      </div>

      {/* Mobile Hamburger */}
      <div className="md:hidden flex items-center">
        <button
          onClick={toggleMenu}
          className="bg-white/30 backdrop-blur-sm p-2 rounded-md shadow hover:bg-white/50 transition"
        >
          {menuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
        </button>
      </div>

      {/* Mobile Slide-Up Menu */}
      {menuOpen && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-purple-600/90 backdrop-blur-md rounded-t-3xl shadow-2xl p-6 flex flex-col gap-4 animate-slideUp">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-1.5 bg-white rounded-full"></div>
          </div>

          <span className="text-white font-semibold text-center">Welcome, Admin</span>

          <div className="flex flex-col gap-3">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center p-3 rounded-lg font-medium text-lg transition ${isActive(
                  item.path
                )}`}
              >
                <span className="mr-3">{item.icon}</span> {item.label}
              </Link>
            ))}
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center bg-red-500 text-white text-lg py-3 rounded-lg font-bold hover:bg-red-600 mt-4 transition"
          >
            <FaSignOutAlt className="mr-2" /> Logout
          </button>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          0% { transform: translateY(100%); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .animate-slideUp { animation: slideUp 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
}

export default Navbar;
