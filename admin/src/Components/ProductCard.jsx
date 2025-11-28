import React, { useEffect, useState, useRef } from "react";

const ProductCard = ({ product, onView }) => {
  const images = product.images?.length > 0 ? product.images : [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const containerRef = useRef(null);

  // Desktop hover slideshow
  useEffect(() => {
    if (!images.length || isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [images.length, isHovered]);

  // Mobile swipe handlers
  const handleTouchStart = (e) => {
    setIsDragging(true);
    startX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const diff = e.touches[0].clientX - startX.current;
    if (diff > 50) {
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
      setIsDragging(false);
    } else if (diff < -50) {
      setCurrentIndex((prev) => (prev + 1) % images.length);
      setIsDragging(false);
    }
  };

  const handleTouchEnd = () => setIsDragging(false);

  return (
    <div
      ref={containerRef}
      onClick={() => onView(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="bg-white rounded-xl shadow hover:shadow-lg p-4 cursor-pointer transition duration-300 flex flex-col h-full relative overflow-hidden"
    >
      {/* Product Image */}
      {images.length > 0 ? (
        <div className="w-full rounded-lg overflow-hidden mb-3 relative">
          <img
            src={images[currentIndex]}
            alt={product.title}
            className="w-full object-cover rounded-lg transition-transform duration-300 ease-in-out
                       h-36 sm:h-44 md:h-52 lg:h-60 xl:h-64"
          />

          {/* Dots for mobile/desktop */}
          {images.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {images.map((_, idx) => (
                <span
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    idx === currentIndex ? "bg-blue-600" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="w-full rounded-lg mb-3 bg-gray-100 flex items-center justify-center text-gray-400 text-sm
                        h-36 sm:h-44 md:h-52 lg:h-60 xl:h-64">
          No Image Available
        </div>
      )}

      {/* Product Info */}
      <h3 className="font-semibold text-lg text-gray-800">{product.title}</h3>
      <p className="text-gray-600 text-sm mb-1">
        {product.category?.name || "Uncategorized"}
      </p>
      <p className="text-gray-500 text-xs line-clamp-2 flex-grow">{product.description}</p>

      {/* Product Link */}
      {product.link && (
        <a
          href={product.link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="mt-2 text-blue-600 text-sm hover:underline"
        >
          Visit Product
        </a>
      )}
    </div>
  );
};

export default ProductCard;
