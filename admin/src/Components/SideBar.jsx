import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/authContext.jsx";
import { FaHome, FaPlus, FaThList, FaSignOutAlt, FaBars } from "react-icons/fa";
import axiosInstance from "../utils/axiosInstance.js";

const SideBar = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  let startY = 0;

  const isActive = (path) =>
    location.pathname === path
      ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg"
      : "text-gray-700 hover:bg-gray-100";

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/admin/logout");
      logout();
      navigate("/");
      alert("👋 Logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
      alert(error.response?.data?.message || "Failed to logout");
    }
  };

  const handleTouchStart = (e) => {
    startY = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    const moveY = e.touches[0].clientY;
    if (moveY - startY > 70) setSidebarOpen(false);
  };

  const menuItems = [
    { icon: <FaHome />, label: "Dashboard", path: "/home" },
    { icon: <FaPlus />, label: "Add Product", path: "/add-product" },
    { icon: <FaThList />, label: "Add Category", path: "/add-category" },
  ];

  return (
    <>
      {/* Mobile Floating Button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="sm:hidden fixed bottom-6 right-6 z-50 bg-blue-600 p-4 rounded-full shadow-lg text-white"
      >
        <FaBars size={20} />
      </button>

      {/* Backdrop Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm sm:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Mobile Bottom Sheet */}
      <div
        className={`fixed w-full left-0 z-50 bg-white rounded-t-2xl sm:hidden shadow-xl transition-transform duration-300 ${
          sidebarOpen ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ bottom: 0 }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        <div className="w-full flex justify-center py-3">
          <div className="w-12 h-1.5 bg-gray-400 rounded-full"></div>
        </div>

        <div className="flex flex-col p-6 space-y-4">
          <h2 className="text-xl font-bold text-blue-600 text-center pb-2">
            Admin Menu
          </h2>

          {/* Added All menu options for Mobile */}
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center p-3 rounded-lg font-medium text-lg transition ${isActive(
                item.path
              )}`}
            >
              <span className="mr-3">{item.icon}</span> {item.label}
            </Link>
          ))}

          <button
            onClick={handleLogout}
            className="flex items-center justify-center bg-red-500 text-white text-lg py-3 rounded-lg font-semibold hover:bg-red-600 transition"
          >
            <FaSignOutAlt className="mr-2" /> Logout
          </button>
        </div>
      </div>

      {/* Desktop Sidebar (UNCHANGED) */}
      <div className="hidden sm:flex fixed top-0 left-0 w-72 h-screen bg-white border-r shadow-lg p-6 flex-col justify-between overflow-hidden">
        {/* Animated Floating Background */}
        <div className="absolute w-36 h-36 bg-pink-400 rounded-full opacity-30 top-[-50px] left-[-50px] animate-diagonalSlow"></div>
        <div className="absolute w-48 h-48 bg-pink-300 rounded-full opacity-20 bottom-[-80px] right-[-60px] animate-diagonalSlowReverse"></div>
        <div className="absolute w-24 h-24 bg-pink-500 rounded-full opacity-25 top-[150px] right-[50px] animate-diagonalSlow"></div>

        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 bg-white rounded-full opacity-70 animate-particle${i % 3}`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}

        <div className="relative z-10 flex flex-col justify-between h-full">
          <div>
            <h2 className="text-2xl font-extrabold text-blue-600 mb-10 tracking-wide text-center">
              Admin Panel
            </h2>
            <nav className="flex flex-col space-y-3">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center p-3 rounded-lg font-medium transition ${isActive(
                    item.path
                  )}`}
                >
                  <span className="mr-3">{item.icon}</span> {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center bg-red-500 text-white p-3 rounded-lg font-medium hover:bg-red-600 transition shadow-md"
          >
            <FaSignOutAlt className="mr-2" /> Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default SideBar;
