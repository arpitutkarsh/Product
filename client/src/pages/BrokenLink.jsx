import { Link } from "react-router-dom";
import { Moon } from "lucide-react";
import { motion } from "framer-motion";

function BrokenLink() {
  // Helper to generate stars
  const stars = Array.from({ length: 120 });

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-black via-gray-900 to-gray-950 text-white">
      {/* 🌌 Layered Stars */}
      {stars.map((_, i) => (
        <motion.span
          key={i}
          className="absolute bg-white rounded-full"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 2 + 0.5}px`,
            height: `${Math.random() * 2 + 0.5}px`,
            opacity: Math.random() * 0.7 + 0.3,
          }}
          animate={{
            y: [0, -5, 0],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 2 + Math.random() * 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* 🌠 Multiple Shooting Stars */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-0.5 h-16 bg-white rounded-sm opacity-70"
          initial={{ x: -100, y: Math.random() * 500, rotate: -30 }}
          animate={{ x: 900, y: Math.random() * 600 }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            repeatDelay: 5 + Math.random() * 5,
            ease: "linear",
          }}
        />
      ))}

      {/* 🌙 Glowing Moon */}
      <motion.div
        className="absolute top-12 right-16 w-28 h-28 bg-gray-200 rounded-full shadow-[0_0_100px_20px_rgba(255,255,255,0.3)]"
        initial={{ y: -10 }}
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <Moon className="absolute top-1/3 left-1/3 text-gray-900" size={40} />
      </motion.div>

      {/* 🌌 Main Text */}
      <motion.div
        className="relative z-10 text-center px-6"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <motion.h1
          className="text-4xl md:text-5xl font-bold mb-4 text-white tracking-wide drop-shadow-lg"
          animate={{ y: [0, -5, 0], scale: [1, 1.03, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          Oops! Broken Link
        </motion.h1>
        <p className="text-gray-300 text-lg mb-8 drop-shadow-sm">
          Looks like you’ve wandered into the cosmic void. <br />
          This page doesn’t exist or has drifted away.
        </p>

        <Link
          to="/"
          className="inline-block px-6 py-2.5 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition-all"
        >
          Go Back Home
        </Link>
      </motion.div>

      {/* ✨ Subtle Overlay Glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none"></div>
    </div>
  );
}

export default BrokenLink;
