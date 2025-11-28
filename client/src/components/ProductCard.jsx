import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ExternalLink, ImageOff } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  // Include QR code as last media item
  const media = product.images?.length > 0 ? [...product.images, "QR_CODE"] : ["QR_CODE"];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  // Auto-slide
  useEffect(() => {
    if (!media.length || isHovered || isVideoPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % media.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [media.length, isHovered, isVideoPlaying]);

  const nextSlide = (e) => { e.stopPropagation(); setCurrentIndex((prev) => (prev + 1) % media.length); };
  const prevSlide = (e) => { e.stopPropagation(); setCurrentIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1)); };
  const handleVideoPlay = () => setIsVideoPlaying(true);
  const handleVideoPause = () => setIsVideoPlaying(false);

  // Navigate to product detail page
  const goToProductDetail = () => navigate(`/product/${product._id}`);

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      onClick={goToProductDetail}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        if (videoRef.current) videoRef.current.pause();
        setIsVideoPlaying(false);
      }}
      className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-3xl shadow-xl hover:shadow-2xl overflow-hidden cursor-pointer transition-all duration-300 flex flex-col relative"
    >
      {/* Media Carousel */}
      <div className="relative w-full h-64 md:h-72 lg:h-80 bg-gray-100 overflow-hidden rounded-t-3xl">
        {!loaded ? (
          <div className="w-full h-full bg-gray-300 animate-pulse rounded-t-3xl" />
        ) : media.length > 0 ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex justify-center items-center"
            >
              {media[currentIndex] === "QR_CODE" ? (
                <div
                  onClick={(e) => { e.stopPropagation(); goToProductDetail(); }}
                  className="flex flex-col items-center justify-center p-4 bg-white/30 backdrop-blur-xl rounded-xl shadow-lg border border-white/40 cursor-pointer"
                >
                  <QRCodeCanvas
                    value={`/product/${product._id}`} // relative route for SPA navigation
                    size={120}
                    level="H"
                  />
                  <p className="text-gray-700 text-sm mt-2 font-medium text-center">
                    Scan to view product
                  </p>
                </div>
              ) : media[currentIndex].endsWith(".mp4") ? (
                <video
                  ref={videoRef}
                  src={media[currentIndex]}
                  onPlay={handleVideoPlay}
                  onPause={handleVideoPause}
                  onEnded={handleVideoPause}
                  controls
                  muted
                  className="w-full h-full object-cover rounded-t-3xl"
                />
              ) : (
                <img
                  src={media[currentIndex]}
                  alt={product.title}
                  className="w-full h-full object-cover rounded-t-3xl"
                />
              )}
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
            <ImageOff size={40} />
            <span className="text-sm mt-2">No Media Available</span>
          </div>
        )}

        {/* Navigation Arrows */}
        {media.length > 1 && loaded && (
          <>
            <button
              onClick={prevSlide}
              className={`absolute top-1/2 left-3 -translate-y-1/2 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 text-white p-2 rounded-full shadow-lg transition transform ${
                isHovered ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none"
              }`}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextSlide}
              className={`absolute top-1/2 right-3 -translate-y-1/2 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 text-white p-2 rounded-full shadow-lg transition transform ${
                isHovered ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none"
              }`}
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-grow justify-between">
        {!loaded ? (
          <div className="space-y-2">
            <div className="h-5 bg-gray-300 rounded w-3/4 mx-auto animate-pulse" />
            <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto animate-pulse" />
            <div className="h-3 bg-gray-300 rounded w-full mx-auto animate-pulse mt-2" />
            <div className="h-3 bg-gray-300 rounded w-full mx-auto animate-pulse mt-1" />
            <div className="h-4 bg-gray-300 rounded w-2/3 mx-auto animate-pulse mt-3" />
            <div className="h-4 bg-gray-300 rounded w-1/3 mx-auto animate-pulse mt-1" />
          </div>
        ) : (
          <>
            <h3 className="font-bold text-lg md:text-xl text-gray-900 text-center truncate">
              {product.title}
            </h3>
            <p className="text-sm md:text-base text-gray-600 text-center mt-1">
              {product.category?.name || "Uncategorized"}
            </p>
            <p className="text-gray-500 text-sm mt-2 line-clamp-2 text-center">
              {product.description || "No description available."}
            </p>
            <p className="text-gray-800 text-sm font-mono text-center mt-3">
              Product ID: <span className="font-semibold">{product.productId}</span>
            </p>
            {product.link && (
              <a
                href={product.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center justify-center gap-1 text-purple-600 font-medium text-sm mt-3 hover:underline hover:text-pink-500 transition"
              >
                <ExternalLink size={14} />
                View Product
              </a>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};

export default ProductCard;
