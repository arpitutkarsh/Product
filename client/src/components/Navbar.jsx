import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "../assets/Logo.png";

function Navbar() {
  const navigate = useNavigate();
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY < 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 w-full flex justify-center transition-all duration-500 ${
        isAtTop ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className="
          w-[90%] md:w-[90%] lg:w-[100%]
          px-6 md:px-12 py-3
          bg-white/20
          backdrop-blur-2xl
          border border-white/30
          rounded-full
          flex items-center justify-between
          shadow-lg
          transition-all duration-500
          hover:shadow-2xl
        "
      >
        {/* Logo + Brand */}
        <div
          className="flex items-center gap-4 cursor-pointer transition-all duration-300 hover:scale-105"
          onClick={() => navigate("/")}
        >
          {/* Logo Wrapper */}
          <div
            className="
              h-14 w-14 md:h-16 md:w-16
              flex items-center justify-center
              rounded-2xl
              
              shadow-lg
              transition-all duration-300 hover:shadow-2xl
            "
          >
            <img
              src={logo}
              alt="Logo"
              className="h-10 w-10 md:h-12 md:w-12 object-contain select-none"
            />
          </div>

          <span
            className="
              hidden md:block
              text-gray-50
              font-bold text-2xl md:text-3xl
              tracking-wider
              drop-shadow-md
            "
          >
            Smart Buy
          </span>
        </div>

        {/* Optional Tagline or Accent */}
        <div className="hidden md:flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500 shadow-lg animate-pulse"></span>
          <span className="text-black ml-40 font-medium text-sm tracking-wide select-none">
            Shopping Made Simple
          </span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
