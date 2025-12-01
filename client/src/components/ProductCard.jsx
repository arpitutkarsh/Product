import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ExternalLink, ImageOff } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { useSwipeable } from "react-swipeable";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const media = product.images?.length > 0 ? [...product.images, "QR_CODE"] : ["QR_CODE"];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const videoRef = useRef(null);
  const isMobile = window.innerWidth < 640;

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!media.length || isHovered || isVideoPlaying || isMobile) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % media.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [media.length, isHovered, isVideoPlaying, isMobile]);

  const nextSlide = (e) => {
    e?.stopPropagation();
    setCurrentIndex(prev => (prev + 1) % media.length);
  };
  const prevSlide = (e) => {
    e?.stopPropagation();
    setCurrentIndex(prev => (prev === 0 ? media.length - 1 : prev - 1));
  };

  const goToProductDetail = () => navigate(`/product/${product._id}`);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: nextSlide,
    onSwipedRight: prevSlide,
    preventDefaultTouchmoveEvent: true
  });

  return (
    <motion.div
      whileHover={{ scale: isMobile ? 1 : 1.04 }}
      transition={{ duration: 0.25 }}
      onClick={goToProductDetail}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        if (videoRef.current) videoRef.current.pause();
        setIsVideoPlaying(false);
      }}
      className="bg-white/40 backdrop-blur-md border border-white/20 rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden cursor-pointer flex flex-col"
    >
      {/* Media */}
      <div
        {...swipeHandlers}
        className="relative w-full aspect-square bg-gray-100 flex items-center justify-center overflow-hidden"
      >
        {!loaded ? (
          <div className="w-full h-full bg-gray-200 animate-pulse" />
        ) : media.length > 0 ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0.4 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              {media[currentIndex] === "QR_CODE" ? (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    goToProductDetail();
                  }}
                  className="flex flex-col items-center justify-center p-3 bg-white/70 backdrop-blur-sm rounded-xl"
                >
                  <QRCodeCanvas
                    value={`https://smart-buy-d03e.onrender.com/api/ver1/product/${product._id}`}
                    size={isMobile ? 90 : 120}
                    level="H"
                  />
                  <p className="text-gray-700 text-xs mt-2">Scan to view</p>
                </div>
              ) : media[currentIndex].endsWith(".mp4") ? (
                <video
                  ref={videoRef}
                  src={media[currentIndex]}
                  muted
                  controls
                  onPlay={() => setIsVideoPlaying(true)}
                  onPause={() => setIsVideoPlaying(false)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={media[currentIndex]}
                  alt={product.title || "Product"}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              )}
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="text-gray-500 flex flex-col items-center">
            <ImageOff size={36} />
            <span className="text-xs mt-2">No Media</span>
          </div>
        )}

        {/* Navigation Arrows */}
        {media.length > 1 && loaded && !isMobile && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-purple-500/70 hover:bg-purple-600 text-white p-2 rounded-full"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-purple-500/70 hover:bg-purple-600 text-white p-2 rounded-full"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {/* Info */}
      <div className="p-3 text-center flex flex-col gap-1">
        {!loaded ? (
          <div className="h-5 bg-gray-300 animate-pulse rounded w-3/4 mx-auto" />
        ) : (
          <>
            <h3 className="font-semibold text-gray-900 text-sm truncate">
              {product.title || "Untitled Product"}
            </h3>

            <p className="text-[12px] text-gray-600">
              {product.category?.name || "Uncategorized"}
            </p>

            {product.link && (
              <a
                href={product.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-purple-600 text-xs font-medium mt-1 hover:underline flex justify-center items-center gap-1"
              >
                <ExternalLink size={12} />
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
