import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function Loader({ duration = 3000 }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  const colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"]; // Blue, Green, Yellow, Red

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed inset-0 flex flex-col justify-center items-center bg-gray-900/90 z-50"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* 🔄 Multi-colored Spinner */}
          <motion.div
            className="w-20 h-20 rounded-full border-4 border-t-4 animate-spin mb-6"
            style={{
              borderTopColor: colors[Math.floor(Math.random() * colors.length)],
              borderRightColor: colors[Math.floor(Math.random() * colors.length)],
              borderBottomColor: colors[Math.floor(Math.random() * colors.length)],
              borderLeftColor: colors[Math.floor(Math.random() * colors.length)],
            }}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          />

          {/* ✨ Animated Loading Text with Bouncing Dots */}
          <motion.div
            className="text-white text-lg font-semibold flex items-center gap-1"
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
          >
            Loading
            <motion.span
              className="text-blue-400"
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
            >
              .
            </motion.span>
            <motion.span
              className="text-green-400"
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
            >
              .
            </motion.span>
            <motion.span
              className="text-red-400"
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
