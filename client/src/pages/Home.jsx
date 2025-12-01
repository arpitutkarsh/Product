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
      setSearchActive(true);
      setShowSearch(false);
    } catch {
      setError("Product does not exist.");
      setSearchActive(true);
      setShowSearch(false);
    }
  };

  const clearSearch = (e) => {
    e.stopPropagation();
    setSearchId("");
    setSearchActive(false);
    setError("");
  };

  if (loading) return <Loader />;

  return (
    <div className="relative min-h-screen bg-gray-50 px-4 sm:px-8 pt-28 pb-10 hide-scrollbar">
      {/* ⬆️ NOTE: Changed from py-8 to pt-28 pb-10 to prevent overlap */}

      {/* Floating Search Button */}
      <button
        onClick={() => setShowSearch(true)}
        className="fixed top-6 right-6 z-50 bg-blue-600 text-white p-3 rounded-full shadow-xl hover:scale-105 transition-transform"
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
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 120, damping: 15 }}
              className="fixed top-0 right-0 w-80 h-full z-50 p-6 bg-white shadow-xl overflow-y-auto rounded-l-2xl"
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
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Products Section */}
      <h3 className="text-3xl font-bold mb-10 text-center tracking-wide text-gray-800">
        All Products
      </h3>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 pb-16">
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
