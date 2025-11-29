import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function Loader({ duration = 3000 }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  const colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"]; // Blue, Green, Yellow, Red
  const isMobile = window.innerWidth < 640;

  const spinnerSize = isMobile ? 12 : 20; // in rem / tailwind units
  const spinnerBorder = isMobile ? 3 : 4;
  const textSize = isMobile ? "text-base" : "text-lg";
  const dotSize = isMobile ? 3 : 4;

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className={`fixed inset-0 flex flex-col justify-center items-center ${
            isMobile ? "bg-gray-900/80" : "bg-gray-900/90"
          } z-50`}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* 🔄 Multi-colored Spinner */}
          <motion.div
            className={`rounded-full animate-spin mb-6`}
            style={{
              width: `${spinnerSize}rem`,
              height: `${spinnerSize}rem`,
              borderWidth: spinnerBorder,
              borderTopColor: colors[Math.floor(Math.random() * colors.length)],
              borderRightColor: colors[Math.floor(Math.random() * colors.length)],
              borderBottomColor: colors[Math.floor(Math.random() * colors.length)],
              borderLeftColor: colors[Math.floor(Math.random() * colors.length)],
              boxShadow: !isMobile
                ? `0 0 20px ${colors[Math.floor(Math.random() * colors.length)]}`
                : "none",
            }}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          />

          {/* ✨ Animated Loading Text with Bouncing Dots */}
          <motion.div
            className={`text-white font-semibold flex items-center gap-1 ${textSize}`}
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
          >
            Loading
            <motion.span
              className="text-blue-400"
              style={{ fontSize: `${dotSize}rem` }}
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
            >
              .
            </motion.span>
            <motion.span
              className="text-green-400"
              style={{ fontSize: `${dotSize}rem` }}
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
            >
              .
            </motion.span>
            <motion.span
              className="text-red-400"
              style={{ fontSize: `${dotSize}rem` }}
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
            >
              .
            </motion.span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Loader;
