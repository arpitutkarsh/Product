// ✨ Ready to paste — UI improved only ✨
import { useEffect, useState, useMemo, Suspense, lazy } from "react";
import axios from "axios";
import Loader from "../components/Loader.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import exclusiveDeals from "../assets/exc.png";
import trending from "../assets/trendingnow.jpg";
const ProductCard = lazy(() => import("../components/ProductCard.jsx"));

const BASE_URL = "https://backend-9lc5.onrender.com/api/ver1/product";

function Home() {
  const [products, setProducts] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [visibleCount, setVisibleCount] = useState(8);
  const [recentSearches, setRecentSearches] = useState([]);

  const navigate = useNavigate();
  const isMobile = window.innerWidth < 640;

  const banners = [
    {
      src: "/banners/banner1.jpg",
      title: "Smart Buy",
      subtitle: "Luxury at your fingertips",
      gradient: "from-blue-600/50 via-purple-500/40 to-pink-400/40",
    },
    {
      src: exclusiveDeals,
      title: "Exclusive Deals",
      subtitle: "Unveil premium discounts",
      gradient: "from-green-500/50 via-blue-500/30 to-indigo-500/40",
    },
    {
      src: trending,
      title: "Trending Now",
      subtitle: "Most-loved this week",
      gradient: "from-red-400/50 via-orange-300/30 to-yellow-300/40",
    },
  ];

  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("recentSearches")) || [];
    setRecentSearches(stored);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/getAllProduct`);
        setProducts(res.data.data || []);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() =>
    setInterval(() => setCurrentBanner(prev => (prev + 1) % banners.length), 4000),
  []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300) {
        setVisibleCount(prev => prev + 8);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredProducts = useMemo(() => {
    if (!searchId.trim()) return products;
    return products.filter(p =>
      p.productId?.toLowerCase().includes(searchId.trim().toLowerCase())
    );
  }, [products, searchId]);

  const clearSearch = () => {
    setSearchId("");
    setSearchActive(false);
    setError("");
  };

  if (loading) return <Loader />;

  return (
    <div className="bg-gray-50 min-h-screen">
      
      {/* 🔹 Banner Slider */}
      <div className="relative w-full h-52 sm:h-64 md:h-72 overflow-hidden rounded-b-xl shadow">
        <motion.img
          key={currentBanner}
          src={banners[currentBanner].src}
          initial={{ opacity: 0.4, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className={`absolute inset-0 bg-gradient-to-r ${banners[currentBanner].gradient}`}
        />
        <div className="absolute left-6 bottom-6 text-white">
          <h2 className="text-xl sm:text-2xl font-bold drop-shadow-lg">
            {banners[currentBanner].title}
          </h2>
          <p className="text-sm sm:text-base opacity-90">
            {banners[currentBanner].subtitle}
          </p>
        </div>
      </div>

      {/* 🔍 Floating Search */}
      <button
        onClick={() => setShowSearch(true)}
        className="fixed bottom-6 right-6 bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full shadow-lg transition z-50"
      >
        <Search />
      </button>
      
      {searchActive && (
        <button
          onClick={clearSearch}
          className="fixed bottom-20 right-6 bg-red-600 text-white p-3 rounded-full shadow-lg hover:bg-red-700 z-50"
        >
          <X size={14} />
        </button>
      )}

      {/* 🔻 Slide Search Drawer */}
      <AnimatePresence>
        {showSearch && (
          <>
            <motion.div
              onClick={() => setShowSearch(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
            />

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 20 }}
              className="fixed bottom-0 left-0 w-full bg-white p-5 rounded-t-2xl z-50 shadow-2xl"
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSearchActive(true);
                  setShowSearch(false);
                }}
                className="flex gap-3"
              >
                <input
                  type="text"
                  placeholder="Enter Product ID"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  autoFocus
                  className="flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500"
                />
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg">
                  Search
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 🏷️ Section Title */}
      <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4 text-center">
        Explore Products
      </h3>

      {/* 🛍 Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 px-4 pb-12">
        <Suspense fallback={<Loader />}>
          {filteredProducts.slice(0, visibleCount).map((p, i) => (
            <motion.div
              key={p._id}
              whileHover={{ scale: 1.03 }}
              className="bg-white rounded-2xl shadow hover:shadow-xl transition p-3 cursor-pointer"
              onClick={() => navigate(`/product/${p._id}`)}
            >
              <ProductCard product={p} />
            </motion.div>
          ))}
        </Suspense>
      </div>
    </div>
  );
}

export default Home;
