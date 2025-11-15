import React, { useEffect, useState } from "react";

const ProductCard = ({ product, onView }) => {
  const images = product.images?.length > 0 ? product.images : [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-slide logic
  useEffect(() => {
    if (!images.length || isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 2500); // change every 2.5 seconds

    return () => clearInterval(interval);
  }, [images.length, isHovered]);

  return (
    <div
      onClick={() => onView(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-white rounded-xl shadow hover:shadow-lg p-4 cursor-pointer transition duration-300 flex flex-col"
    >
      {/* Product Image */}
      {images.length > 0 ? (
        <img
          src={images[currentIndex]}
          alt={product.title}
          className="w-full h-100 object-cover rounded-lg mb-3 transition-all duration-200 ease-in-out"
        />
      ) : (
        <div className="w-full h-100 bg-gray-100 flex items-center justify-center rounded-lg mb-3 text-gray-400 text-sm">
          No Image Available for this Product
        </div>
      )}

      {/* Product Info */}
      <h3 className="font-semibold text-lg text-gray-800">{product.title}</h3>
      <p className="text-gray-600 text-sm mb-1">
        {product.category?.name || "Uncategorized"}
      </p>
      <p className="text-gray-500 text-xs line-clamp-2">{product.description}</p>

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

      {/* Image indicator dots (optional, nice touch) */}
      {images.length > 1 && (
        <div className="flex justify-center mt-2 space-x-1">
          {images.map((_, idx) => (
            <span
              key={idx}
              className={`w-2 h-2 rounded-full ${
                idx === currentIndex ? "bg-blue-600" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductCard;
