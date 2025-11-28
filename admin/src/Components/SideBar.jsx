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

  const menuItems = [
    { icon: <FaHome />, label: "Dashboard", path: "/home" },
    { icon: <FaPlus />, label: "Add Product", path: "/add-product" },
    { icon: <FaThList />, label: "Add Category", path: "/add-category" },
  ];

  return (
    <>
      {/* Hamburger button for mobile */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="sm:hidden fixed top-4 left-4 z-50 p-3 bg-blue-500 text-white rounded-lg shadow-lg"
      >
        <FaBars />
      </button>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity ${
          sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        } sm:hidden`}
        onClick={() => setSidebarOpen(false)}
      ></div>
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-xl z-50 transform transition-transform duration-300 sm:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-6 justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-blue-600 mb-10 text-center">
              Admin Panel
            </h2>
            <nav className="flex flex-col space-y-3">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center p-3 rounded-lg font-medium transition ${isActive(item.path)}`}
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

      {/* Desktop Sidebar */}
      <div className="hidden sm:flex fixed top-0 left-0 w-72 h-screen bg-white border-r shadow-lg p-6 flex-col justify-between overflow-hidden">
        {/* Animated floating background */}
        <div className="absolute w-36 h-36 bg-pink-400 rounded-full opacity-30 top-[-50px] left-[-50px] animate-diagonalSlow"></div>
        <div className="absolute w-48 h-48 bg-pink-300 rounded-full opacity-20 bottom-[-80px] right-[-60px] animate-diagonalSlowReverse"></div>
        <div className="absolute w-24 h-24 bg-pink-500 rounded-full opacity-25 top-[150px] right-[50px] animate-diagonalSlow"></div>

        <div className="absolute w-2 h-2 bg-yellow-400 rounded-full top-[40px] left-[60px] animate-twinkleDiagonal"></div>
        <div className="absolute w-1.5 h-1.5 bg-yellow-300 rounded-full top-[120px] right-[100px] animate-twinkleDiagonalReverse"></div>

        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 bg-white rounded-full opacity-70 animate-particle${i % 3}`}
            style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
          ></div>
        ))}

        {/* Content */}
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
                  className={`flex items-center p-3 rounded-lg font-medium transition ${isActive(item.path)}`}
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

      {/* Tailwind Animations */}
      <style>{`
        @keyframes diagonal {
          0% { transform: translate(0,0); }
          50% { transform: translate(20px,20px); }
          100% { transform: translate(0,0); }
        }
        @keyframes diagonalReverse {
          0% { transform: translate(0,0); }
          50% { transform: translate(-20px,-20px); }
          100% { transform: translate(0,0); }
        }
        .animate-diagonalSlow { animation: diagonal 8s infinite ease-in-out; }
        .animate-diagonalSlowReverse { animation: diagonalReverse 8s infinite ease-in-out; }

        @keyframes twinkle {
          0%,100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.3); }
        }
        .animate-twinkleDiagonal { animation: twinkle 4s infinite; }
        .animate-twinkleDiagonalReverse { animation: twinkle 5s infinite; }

        @keyframes particle1 {0%{transform:translateY(0px);opacity:0.5}50%{transform:translateY(-8px);opacity:1}100%{transform:translateY(0px);opacity:0.5}}
        @keyframes particle2 {0%{transform:translateX(0px);opacity:0.4}50%{transform:translateX(6px);opacity:0.9}100%{transform:translateX(0px);opacity:0.4}}
        @keyframes particle3 {0%{transform:translate(0,0) rotate(0deg);opacity:0.5}50%{transform:translate(4px,-4px) rotate(180deg);opacity:1}100%{transform:translate(0,0) rotate(0deg);opacity:0.5}}
        .animate-particle0 { animation: particle1 6s infinite ease-in-out; }
        .animate-particle1 { animation: particle2 5s infinite ease-in-out; }
        .animate-particle2 { animation: particle3 7s infinite ease-in-out; }
      `}</style>
    </>
  );
};

export default SideBar;
