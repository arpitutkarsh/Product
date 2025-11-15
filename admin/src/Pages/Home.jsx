import React , { useEffect, useState, useMemo } from "react";
import Sidebar from "../Components/SideBar.jsx";
import Navbar from "../Components/Navbar.jsx";
import ProductCard from "../Components/ProductCard.jsx";
import ProductModal from "../Components/ProductModal.jsx";
import axiosInstance from "../utils/axiosInstance.js";

// Memoized ProductCard for performance
const MemoizedProductCard = React.memo(ProductCard);

const Home = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosInstance.get("/product/getAllProduct");
        if (res.data?.data) setProducts(res.data.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filtered products using useMemo
  const filteredProducts = useMemo(() => {
    const query = search.toLowerCase();
    if (!query) return products;
    return products.filter(
      (p) =>
        p.title?.toLowerCase().includes(query) ||
        p.category?.toLowerCase().includes(query)
    );
  }, [search, products]);

  return (
    <div className="relative flex bg-gradient-to-b from-gray-100 to-gray-200 min-h-screen overflow-hidden">
      {/* Sidebar fixed */}
      <div className="fixed left-0 top-0 h-screen z-20 overflow-y-auto scrollbar-hide">
        <Sidebar />
      </div>

      {/* Decorative bubbles and stars */}
      <div className="absolute top-0 left-72 right-0 bottom-0 overflow-hidden pointer-events-none z-0">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-pink-400 opacity-20 animate-bubbleDiagonal"
            style={{
              width: `${30 + Math.random() * 50}px`,
              height: `${30 + Math.random() * 50}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 98}%`,
              animationDuration: `${8 + Math.random() * 7}s`,
            }}
          ></div>
        ))}
        {Array.from({ length: 25 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-yellow-300 opacity-70 animate-twinkleDiagonal"
            style={{
              width: `${2 + Math.random() * 3}px`,
              height: `${2 + Math.random() * 3}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 98}%`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col ml-72 z-10 overflow-hidden">
        <Navbar />

        <div className="p-6 overflow-y-auto scrollbar-hide">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="text-3xl font-extrabold text-gray-800 tracking-wide">
              All Products
            </h2>
            <label htmlFor="search" className="sr-only">Search Products</label>
            <input
              id="search"
              type="text"
              placeholder="Search product..."
              className="border border-gray-300 p-3 rounded-lg w-full sm:w-60 focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300 shadow-sm hover:shadow-md"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Loading / No Products / Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-60 bg-gray-200 animate-pulse rounded-xl"
                />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <p className="text-center text-gray-500 mt-10 text-lg">
              No products found.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <MemoizedProductCard
                  key={product._id}
                  product={product}
                  onView={setSelectedProduct}
                  className="transition transform hover:scale-105 hover:shadow-xl"
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* Animations */}
      <style>{`
        @keyframes bubbleDiagonal {
          0% { transform: translate(0, 0); opacity: 0.2; }
          50% { transform: translate(15px, -25px); opacity: 0.4; }
          100% { transform: translate(0, 0); opacity: 0.2; }
        }
        .animate-bubbleDiagonal { animation: bubbleDiagonal infinite ease-in-out; }

        @keyframes twinkleDiagonal {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.3); }
        }
        .animate-twinkleDiagonal { animation: twinkleDiagonal infinite; }

        /* Hide scrollbars */
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default Home;
