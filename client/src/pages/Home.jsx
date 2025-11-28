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

  const navigate = useNavigate();

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

  const recentProducts = useMemo(() => {
    const now = Date.now();
    return products.filter(p =>
      p.createdAt && now - new Date(p.createdAt).getTime() <= 24 * 60 * 60 * 1000
    );
  }, [products]);

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
      // Get product by productId from backend
      const res = await axios.get(`${BASE_URL}/product/${searchId.trim()}`);
      if (!res.data.data) {
        setError("Product does not exist.");
        setSearchActive(true);
        setShowSearch(false);
        return;
      }

      // Save to recent searches
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

      {/* Slide-in Search Panel */}
      <AnimatePresence>
        {showSearch && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setShowSearch(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 120, damping: 15 }}
              className="fixed top-0 right-0 w-80 h-full z-50 flex flex-col p-6 backdrop-blur-md bg-white/80 shadow-2xl overflow-y-auto rounded-l-xl hide-scrollbar"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-700">Search Product</h2>
                <button onClick={() => setShowSearch(false)} className="text-gray-500 hover:text-gray-700">
                  <X size={22} />
                </button>
              </div>

              <form onSubmit={handleSearch} className="flex flex-col space-y-3">
                <input
                  type="text"
                  placeholder="Enter Product ID"
                  className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-700 shadow-inner"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 text-white px-4 py-2 rounded-lg hover:scale-105 shadow-md transition"
                >
                  Search
                </button>
              </form>

              {recentSearches.length > 0 && (
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-md font-semibold text-gray-700 flex items-center gap-1">
                      <Clock size={18} /> Recent Searches
                    </h3>
                    <button className="text-red-500 text-sm" onClick={clearRecentSearches}>
                      Clear
                    </button>
                  </div>

                  {recentSearches.map((s, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-2 border rounded-lg mb-2 cursor-pointer hover:bg-purple-50 transition"
                      onClick={() => handleRecentSearchClick(s)}
                    >
                      {s.image ? (
                        <img
                          src={s.image}
                          alt={s.name}
                          className="w-12 h-12 object-cover rounded-lg shadow-md"
                        />
                      ) : (
                        <div className="w-12 h-12 flex flex-col items-center justify-center bg-gray-200 text-gray-500 rounded-lg shadow-md text-xs font-medium">
                          <ImageOff size={16} className="mb-1" />
                          No Image
                        </div>
                      )}
                      <p className="font-medium text-gray-800">{s.name}</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {error && <p className="text-red-500 text-center mb-4 mt-4 animate-pulse">{error}</p>}

      {/* Banner temporarily hidden */}

      {/* Recently Added */}
      {recentProducts.length > 0 && (
        <div className="mb-12">
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">Recently Added Products</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 hide-scrollbar">
            <Suspense fallback={<Loader />}>
              {recentProducts.slice(0, visibleCount).map((p, i) => (
                <motion.div
                  key={p._id}
                  whileHover={{ scale: 1.05 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="cursor-pointer"
                  onClick={() => navigate(`/product/${p._id}`)}
                >
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </Suspense>
          </div>
        </div>
      )}

      {/* All Products */}
      {filteredProducts.length > 0 ? (
        <>
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mt-12 mb-6 text-center">All Products</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 hide-scrollbar">
            <Suspense fallback={<Loader />}>
              {filteredProducts.slice(0, visibleCount).map((p, i) => (
                <motion.div
                  key={p._id}
                  whileHover={{ scale: 1.03 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="cursor-pointer"
                  onClick={() => navigate(`/product/${p._id}`)}
                >
                  <ProductCard product={p} />
                </motion.div>
              ))}
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
