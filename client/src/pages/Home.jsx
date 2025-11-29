import { useEffect, useState, useMemo, Suspense, lazy } from "react";
import axios from "axios";
import Loader from "../components/Loader.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
  // Check for mobile on first render and subsequent resize
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  // Debounced resize handler
  useEffect(() => {
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setIsMobile(window.innerWidth < 640);
      }, 150);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);
    };
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

  const removeSingleRecent = (id) => {
    const updated = recentSearches.filter(item => item.id !== id);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  const clearSearch = (e) => {
    e.stopPropagation();
    setSearchId("");
    setSearchActive(false);
    setError("");
  };

  if (loading) return <Loader />;

  const searchVariants = {
    hidden: { x: "100%", y: 0 },
    visible: { x: 0, y: 0 },
    mobileHidden: { x: 0, y: "100%" },
    mobileVisible: { x: 0, y: 0 },
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 hide-scrollbar pt-6 sm:pt-10 px-3 sm:px-6 lg:px-8">

      {/* Floating Search Button */}
      <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[60]"> {/* Increased z-index */}
        <div className="relative">
          <button
            onClick={() => setShowSearch(true)}
            className="bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 text-white p-3 rounded-full shadow-xl hover:scale-110 transition transform"
            title="Search Product"
          >
            <Search size={24} />
          </button>
          {searchActive && (
            <button
              onClick={clearSearch}
              className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full p-1 shadow hover:bg-red-700 transition"
              title="Clear Search"
            >
              <X size={14} />
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
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setShowSearch(false)}
            />
            <motion.div
              initial={isMobile ? "mobileHidden" : "hidden"}
              animate={isMobile ? "mobileVisible" : "visible"}
              exit={isMobile ? "mobileHidden" : "hidden"}
              variants={searchVariants}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
              className={`fixed z-50 flex flex-col p-4 sm:p-6 backdrop-blur-md bg-white/90 shadow-2xl overflow-y-auto hide-scrollbar
                ${isMobile ? "w-full h-5/6 bottom-0 left-0 rounded-t-2xl" : "top-0 right-0 w-96 h-full rounded-l-2xl"}
              `}
            >
              <div className="flex justify-end">
                <button onClick={() => setShowSearch(false)} className="text-gray-500 hover:text-gray-900 transition mb-4">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleSearch} className="flex items-center gap-2 mb-6">
                <input
                  type="text"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  placeholder="Search by Product ID..."
                  className="flex-grow p-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition duration-300"
                  autoFocus
                />
                <button
                  type="submit"
                  className="bg-purple-500 text-white px-4 py-3 rounded-xl hover:bg-purple-600 transition shadow-md"
                >
                  Search
                </button>
              </form>

              {recentSearches.length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-3 border-b pb-2">
                    <h4 className="font-bold text-lg text-gray-800">Recent Searches</h4>
                    <button
                      onClick={clearRecentSearches}
                      className="text-red-500 text-sm hover:text-red-700 transition"
                    >
                      Clear All
                    </button>
                  </div>
                  <ul className="flex flex-col gap-2">
                    {recentSearches.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-purple-50 transition border border-transparent hover:border-purple-300"
                      >
                        <div
                          className="flex items-center gap-3 flex-grow cursor-pointer"
                          onClick={() => handleRecentSearchClick(item)}
                        >
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-10 h-10 object-cover rounded-md shadow-sm"
                            />
                          )}
                          <span className="text-gray-700 font-medium truncate flex-grow">{item.name}</span>
                        </div>
                        <button
                          onClick={() => removeSingleRecent(item.id)}
                          className="text-red-500 hover:text-red-700 transition p-1 rounded-full hover:bg-red-100"
                          title="Remove"
                        >
                          <X size={16} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {error && <p className="text-red-500 text-center mb-6 mt-6 animate-pulse font-medium">{error}</p>}

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <>
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center **pt-16 sm:pt-10**">All Products</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 **pt-2**">
            <Suspense fallback={<Loader />}>
              {filteredProducts.slice(0, visibleCount).map((p, i) => {
                const isNew = p.createdAt && (Date.now() - new Date(p.createdAt).getTime()) <= 24 * 60 * 60 * 1000;
                return (
                  <motion.div
                    key={p._id}
                    whileHover={{ scale: 1.05 }} // Increased hover scale for better feel
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="relative cursor-pointer"
                    onClick={() => navigate(`/product/${p._id}`)}
                  >
                    <ProductCard product={p} />
                    {isNew && (
                      <div className="absolute top-3 left-3 bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                        NEW
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </Suspense>
          </div>
          {visibleCount < filteredProducts.length && (
            <div className="text-center mt-8 pb-10">
              <p className="text-gray-500 font-medium">Scrolling for more products...</p>
            </div>
          )}
        </>
      ) : (
        !error && <p className="text-center mt-20 text-xl font-medium text-gray-600">No products found.</p>
      )}

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

export default Home;