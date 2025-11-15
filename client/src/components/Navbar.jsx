import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "../assets/Logo.png";

function Navbar() {
  const navigate = useNavigate();
  const [isAtTop, setIsAtTop] = useState(true); // ⭐ Track scroll position

  useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY < 50); // Show navbar only if scroll is near top
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 w-full flex justify-center transition-all duration-500 ${
        isAtTop ? "opacity-100" : "opacity-0 pointer-events-none"
      }`} // ⭐ Smooth hide/show with opacity
    >
      <div
        className="
          w-[90%] md:w-[90%] lg:w-[100%]
          mb-4
          px-8 py-4
          bg-white/30
          backdrop-blur-xl
          border border-white/40
          shadow-[0_8px_30px_rgb(0,0,0,0.12)]
          rounded-full
          flex items-center justify-between
          transition-all duration-300
          hover:shadow-[0_8px_40px_rgb(0,0,0,0.2)]
          hover:bg-white/40
        "
      >
        {/* Logo + Brand */}
        <div
          className="
            flex items-center gap-3 cursor-pointer 
            transition-all duration-300 
            hover:scale-105
          "
          onClick={() => navigate("/")}
        >
          {/* Glassmorphic Logo Wrapper */}
          <div
            className="
              h-12 w-12
              flex items-center justify-center
              rounded-xl
              bg-white/30
              backdrop-blur-xl
              border border-white/40
              shadow-[0_4px_20px_rgb(0,0,0,0.15)]
              transition-all duration-300
              hover:shadow-[0_4px_25px_rgba(255,255,255,0.6)]
            "
          >
            <img
              src={logo}
              alt="Client Logo"
              className="h-10 w-10 object-contain select-none"
            />
          </div>

          <span
            className="
            hidden md:block text-gray-800
            font-semibold tracking-wide text-xl
          "
          >
            Smart Buy
          </span>
        </div>

        {/* Tagline Section */}
        <div className="hidden md:flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_4px_rgba(59,130,246,0.5)]"></span>

          <span className="text-gray-600 font-medium text-sm tracking-wide"></span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
