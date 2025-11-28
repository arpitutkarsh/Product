import React, { useState } from "react";
import { UserCircle2, Menu, X } from "lucide-react";

function Navbar({ onMenuToggle }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
    if (onMenuToggle) onMenuToggle(!menuOpen);
  };

  return (
    <div className="bg-gradient-to-r from-purple-600 to-pink-500 shadow-lg px-4 sm:px-8 py-4 flex justify-between items-center relative">
      {/* Left side: Logo/Title */}
      <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-wide">
        Admin Dashboard
      </h1>

      {/* Desktop Right: Welcome + Avatar */}
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

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-purple-600/90 backdrop-blur-md flex flex-col p-4 gap-3 md:hidden z-50 animate-slideDown">
          <span className="text-white font-semibold">Welcome, Admin</span>
          <button className="flex items-center gap-2 text-white bg-white/20 p-2 rounded hover:bg-white/30 transition">
            <UserCircle2 className="w-5 h-5" /> Profile
          </button>
          <button className="text-white bg-red-500 p-2 rounded hover:bg-red-600 transition">
            Logout
          </button>
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default Navbar;
