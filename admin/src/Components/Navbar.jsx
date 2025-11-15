import React from "react";
import { UserCircle2 } from "lucide-react"; // Optional: icon for avatar

function Navbar() {
  return (
    <div className="bg-gradient-to-r from-purple-600 to-pink-500 shadow-lg px-8 py-4 flex justify-between items-center">
      {/* Left side: Logo/Title */}
      <h1 className="text-2xl font-extrabold text-white tracking-wide">
        Admin Dashboard
      </h1>

      {/* Right side: Welcome + Avatar */}
      <div className="flex items-center gap-4">
        <span className="text-white font-medium text-lg hidden md:inline">
          Welcome, Admin
        </span>
        <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:scale-105 transition-transform cursor-pointer">
          <UserCircle2 className="w-7 h-7 text-purple-600" />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
