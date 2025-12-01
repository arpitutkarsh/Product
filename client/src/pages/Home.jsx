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
  const isMobile = window.innerWidth < 640;

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("recentSearches")) || [];
    setRecentSearches(stored);
  }, []);

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

  const saveRecentSearch = (id, name, image) => {
    const newEntry = { id, name, image };
    let updated = [newEntry, ...recentSearches.filter(s => s.id !== newEntry.id)].slice(0, 5);
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
      if (!res.data.data) throw new Error();
      const product = res.data.data;
      saveRecentSearch(product.productId, product.title, product.images?.[0] || null);
      setSearchActive(true);
      setShowSearch(false);
    } catch {
      setError("Product does not exist.");
      setSearchActive(true);
      setShowSearch(false);
    }
  };

  const handleRecentSearchClick = (item) => {
    setSearchId(item.id);
    saveRecentSearch(item.id, item.name, item.image);
    setSearchActive(true);
    setShowSearch(false);
  };

  const clearSearch = () => {
    setSearchId("");
    setSearchActive(false);
    setError("");
  };

  if (loading) return <Loader />;

  return (
    <div className="relative min-h-screen bg-gray-50 px-4 sm:px-8 pt-28 pb-10 hide-scrollbar">

      {/* Gradient Search Button */}
      <button
        onClick={() => setShowSearch(true)}
        className="fixed top-6 right-6 z-50 p-3 rounded-full shadow-xl hover:scale-105 transition-transform bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white"
      >
        <Search size={22} />
      </button>

      {searchActive && (
        <button
          onClick={clearSearch}
          className="fixed top-6 right-20 bg-red-600 text-white p-2 rounded-full z-50 shadow-sm"
        >
          <X size={16} />
        </button>
      )}

      {/* Slide Search Panel */}
      <AnimatePresence>
        {showSearch && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setShowSearch(false)}
            />
            <motion.div
              initial={isMobile ? { y: "100%" } : { x: "100%" }}
              animate={isMobile ? { y: 0 } : { x: 0 }}
              exit={isMobile ? { y: "100%" } : { x: "100%" }}
              transition={{ type: "spring", stiffness: 120, damping: 15 }}
              className={`fixed z-50 ${isMobile ? "bottom-0 w-full h-3/4 rounded-t-2xl" : "top-0 right-0 w-80 h-full rounded-l-2xl"} p-6 bg-white shadow-xl overflow-y-auto`}
            >
              <form onSubmit={handleSearch} className="flex gap-2 mb-6">
                <input
                  type="text"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  placeholder="Search by Product ID..."
                  className="flex-grow p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg">Go</button>
              </form>

              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold mb-2 text-gray-700">Recent Searches</h4>
                  <ul className="flex flex-col gap-3">
                    {recentSearches.map(item => (
                      <li
                        key={item.id}
                        onClick={() => handleRecentSearchClick(item)}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
                      >
                        {item.image && (
                          <img src={item.image} alt={item.name} className="w-10 h-10 rounded-md object-cover" />
                        )}
                        <span className="text-gray-800 font-medium">{item.name}</span>
                        <X
                          size={16}
                          className="ml-auto text-red-500 hover:text-red-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            const updated = recentSearches.filter(s => s.id !== item.id);
                            setRecentSearches(updated);
                            localStorage.setItem("recentSearches", JSON.stringify(updated));
                          }}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Products Section */}
      <h3 className="text-3xl font-bold mb-10 text-center tracking-wide text-gray-800">
        All Products
      </h3>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-16">
          <Suspense fallback={<Loader />}>
            {filteredProducts.slice(0, visibleCount).map((p, i) => (
              <motion.div
                key={p._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="cursor-pointer"
                onClick={() => navigate(`/product/${p._id}`)}
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </Suspense>
        </div>
      ) : (
        !error && <p className="text-center mt-16 text-gray-600 text-lg">No products found.</p>
      )}

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

export default Home;
