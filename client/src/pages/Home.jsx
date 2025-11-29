import { useEffect, useState, useMemo, Suspense, lazy } from "react";
import axios from "axios";
import Loader from "../components/Loader.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import exclusiveDeals from "../assets/exc.png";
import trending from "../assets/trendingnow.jpg";
const ProductCard = lazy(() =>
  import("../components/ProductCard.jsx")
);



const BASE_URL = "https://backend-9lc5.onrender.com/api/ver1/product";

function Home() {
  const [products, setProducts] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [visibleCount, setVisibleCount] = useState(12);

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
        setError("Failed to load products.");
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
    return products.filter((p) =>
      p.productId?.toLowerCase().includes(searchId.trim().toLowerCase())
    );
  }, [products, searchId]);

  const saveRecentSearch = (id) => {
    const product = products.find((p) => p.productId.toLowerCase() === id.toLowerCase());
    if (!product) return;

    const newEntry = {
      id: product.productId,
      name: product.title,
      image: product.images?.[0] || null,
    };

    let updated = [newEntry, ...recentSearches.filter((s) => s.id !== newEntry.id)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchId.trim()) return;

    try {
      const res = await axios.get(`${BASE_URL}/product/${searchId.trim()}`);
      if (!res.data.data) return setError("Product not found.");

      saveRecentSearch(res.data.data.productId);
      setSearchActive(true);
      setError("");
      setShowSearch(false);
    } catch {
      setError("Product not found.");
      setSearchActive(true);
      setShowSearch(false);
    }
  };

  const clearSearch = () => {
    setSearchId("");
    setSearchActive(false);
    setError("");
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  if (loading) return <Loader />;

  const isMobile = window.innerWidth < 640;

  return (
    <div className="pb-10 bg-gray-50 min-h-screen">

      {/* Floating Search Button */}
      {!showSearch && (
        <button
          onClick={() => setShowSearch(true)}
          className="fixed bottom-16 right-5 z-50 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
        >
          <Search size={22} />
        </button>
      )}

      {/* Clear Search Button */}
      {searchActive && !showSearch && (
        <button
          onClick={clearSearch}
          className="fixed bottom-28 right-5 z-50 bg-red-600 text-white p-3 rounded-full shadow-lg hover:bg-red-700 transition"
        >
          <X size={18} />
        </button>
      )}

      {/* Slide Search Panel */}
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
              initial={{ y: 300 }}
              animate={{ y: 0 }}
              exit={{ y: 300 }}
              transition={{ type: "spring", damping: 20 }}
              className="fixed bottom-0 left-0 w-full bg-white p-5 rounded-t-2xl shadow-2xl z-50"
            >
              <form onSubmit={handleSearch} className="flex gap-3">
                <input
                  type="text"
                  className="flex-1 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600"
                  placeholder="Enter Product ID"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  autoFocus
                />
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                  Search
                </button>
              </form>

              {recentSearches.length > 0 && (
                <div className="mt-5">
                  <div className="flex justify-between items-center mb-2">
                    <strong className="text-gray-700">Recent Searches</strong>
                    <button className="text-red-600 text-xs" onClick={clearRecentSearches}>
                      Clear All
                    </button>
                  </div>
                  <ul className="grid gap-2">
                    {recentSearches.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-200"
                        onClick={() => {
                          setSearchId(item.id);
                          handleSearch(new Event("submit"));
                        }}
                      >
                        <span>{item.name}</span>
                        <img
                          src={item.image}
                          className="w-10 h-10 rounded object-cover"
                          alt="recent"
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

      {/* Section Heading */}
      <h3 className="text-2xl font-bold text-gray-800 text-center pt-24 pb-6">
        All Products
      </h3>

      {error && (
        <p className="text-center text-red-600 font-medium mb-4">
          {error}
        </p>
      )}

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 px-4 sm:px-6 md:px-10">
        <Suspense fallback={<Loader />}>
          {filteredProducts.slice(0, visibleCount).map((p) => (
            <motion.div
              key={p._id}
              whileHover={{ scale: 1.03 }}
              className="cursor-pointer"
              onClick={() => navigate(`/product/${p._id}`)}
            >
              {/* Rounded Minimal Card */}
              <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition border border-gray-100 p-3 flex flex-col gap-2">
                <img
                  src={p.images?.[0]}
                  alt={p.title}
                  className="w-full h-40 object-cover rounded-xl"
                />
                <h4 className="text-sm font-medium text-gray-800 truncate">
                  {p.title}
                </h4>
              </div>
            </motion.div>
          ))}
        </Suspense>
      </div>
    </div>
  );
}

export default Home;
