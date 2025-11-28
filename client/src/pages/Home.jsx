import { useEffect, useState, useMemo, Suspense, lazy } from "react";
import axios from "axios";
import Loader from "../components/Loader.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Clock, ImageOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import exclusiveDeals from "../assets/exc.png";
import trending from "../assets/trendingnow.jpg";
const ProductCard = lazy(() => import("../components/ProductCard.jsx"));

const banners = [
  {
    src: "/banners/banner1.jpg",
    title: "Welcome to Smart Buy",
    subtitle: "Curated luxury at your fingertips",
    gradient: "from-purple-600/60 via-pink-400/40 to-yellow-300/30",
  },
  {
    src: exclusiveDeals,
    title: "Exclusive Deals",
    subtitle: "Unveil premium discounts today",
    gradient: "from-green-400/50 via-blue-500/30 to-indigo-500/50",
  },
  {
    src: trending,
    title: "Trending Now",
    subtitle: "Discover what’s loved this week",
    gradient: "from-red-400/50 via-orange-300/30 to-yellow-200/40",
  },
];

const BASE_URL = "https://backend-9lc5.onrender.com/api/ver1/product";

// Flipping timer component
function FlipTimer({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <div className="flip-card relative w-16 h-20 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 text-white font-bold text-2xl flex items-center justify-center rounded-lg shadow-lg">
        <motion.div
          key={value}
          initial={{ rotateX: 90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={{ rotateX: -90, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute w-full h-full flex items-center justify-center"
        >
          {value.toString().padStart(2, "0")}
        </motion.div>
      </div>
      <span className="mt-2 text-sm font-semibold text-gray-700">{label}</span>
    </div>
  );
}

function Home() {
  const [products, setProducts] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [visibleCount, setVisibleCount] = useState(8);
  const [recentSearches, setRecentSearches] = useState([]);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const navigate = useNavigate();
  const launchDate = new Date("2025-11-29T15:00:00");

  // Timer logic
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diff = launchDate - now;

      if (diff <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Load recent searches
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("recentSearches")) || [];
    setRecentSearches(stored);
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/getAllProduct`);
        setProducts(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Banner rotation
  useEffect(() => {
    const timer = setInterval(() => setCurrentBanner(prev => (prev + 1) % banners.length), 5000);
    return () => clearInterval(timer);
  }, []);

  // Infinite scroll
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

  const saveRecentSearch = (id) => {
    const product = products.find(p => p.productId?.toLowerCase() === id.toLowerCase());
    if (!product) return;

    const newEntry = { id: product.productId, name: product.title, image: product.images?.[0] || null };
    let updated = [newEntry, ...recentSearches.filter(s => s.id !== newEntry.id)];
    updated = updated.slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    if (!searchId.trim()) {
      setSearchActive(false);
      setShowSearch(false);
      return;
    }

    try {
      const res = await axios.get(`${BASE_URL}/product/${searchId.trim()}`);
      if (!res.data.data) {
        setError("Product does not exist.");
        setSearchActive(true);
        setShowSearch(false);
        return;
      }

      saveRecentSearch(res.data.data.productId);
      setSearchActive(true);
      setShowSearch(false);
    } catch (err) {
      setError("Product does not exist.");
      setSearchActive(true);
      setShowSearch(false);
    }
  };

  const handleRecentSearchClick = async (item) => {
    setSearchId(item.id);

    try {
      const res = await axios.get(`${BASE_URL}/product/${item.id}`);
      if (!res.data.data) {
        setError("Product does not exist.");
        setSearchActive(true);
        setShowSearch(false);
        return;
      }
      saveRecentSearch(item.id);
      setError("");
      setSearchActive(true);
      setShowSearch(false);
    } catch (err) {
      setError("Product does not exist.");
      setSearchActive(true);
      setShowSearch(false);
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  const clearSearch = (e) => {
    e.stopPropagation();
    setSearchId("");
    setSearchActive(false);
    setError("");
  };

  if (loading) return <Loader />;

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6 hide-scrollbar">
      {/* Floating Search */}
      <div className="fixed top-10 right-6 z-50">
        <div className="relative">
          <button
            onClick={() => setShowSearch(true)}
            className="bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 text-white p-3 rounded-full shadow-xl hover:scale-110 transition transform"
            title="Search Product"
          >
            <Search size={22} />
          </button>
          {searchActive && (
            <button
              onClick={clearSearch}
              className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full p-1 shadow hover:bg-red-700 transition"
              title="Clear Search"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Launch Timer */}
      <div className="max-w-3xl mx-auto my-10 p-6 bg-white rounded-xl shadow-lg text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Website Launches In</h2>
        <div className="flex justify-center gap-4">
          <FlipTimer value={timeLeft.days} label="Days" />
          <FlipTimer value={timeLeft.hours} label="Hours" />
          <FlipTimer value={timeLeft.minutes} label="Minutes" />
          <FlipTimer value={timeLeft.seconds} label="Seconds" />
        </div>
      </div>

      {/* All Products with NEW badge */}
      {filteredProducts.length > 0 ? (
        <>
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mt-12 mb-6 text-center">All Products</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 hide-scrollbar">
            <Suspense fallback={<Loader />}>
              {filteredProducts.slice(0, visibleCount).map((p, i) => {
                const isNew = p.createdAt && (Date.now() - new Date(p.createdAt).getTime()) <= 24 * 60 * 60 * 1000;

                return (
                  <motion.div
                    key={p._id}
                    whileHover={{ scale: 1.03 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="relative cursor-pointer"
                    onClick={() => navigate(`/product/${p._id}`)}
                  >
                    <ProductCard product={p} />

                    {isNew && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full
                                      shadow-md animate-pulse">
                        NEW
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </Suspense>
          </div>
        </>
      ) : (
        !error && <p className="text-center mt-50 text-gray-600">No products found.</p>
      )}

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

export default Home;
