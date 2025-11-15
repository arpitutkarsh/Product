import React, { useState, useEffect } from "react";
import UpdateProductModal from "../Components/UpdateProductModal";
import { ChevronLeft, ChevronRight, X, Minus } from "lucide-react";
import axiosInstance from "../utils/axiosInstance.js";

const ProductModal = ({ product, onClose, onProductUpdated, onProductDeleted }) => {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteText, setDeleteText] = useState("");
  const [currentImage, setCurrentImage] = useState(0);
  const [removeVideo, setRemoveVideo] = useState(false);

  // Auto slideshow
  useEffect(() => {
    if (!product.images?.length) return;
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % product.images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [product.images]);

  const handleNext = () => setCurrentImage((prev) => (prev + 1) % product.images.length);
  const handlePrev = () =>
    setCurrentImage((prev) => (prev - 1 + product.images.length) % product.images.length);

  const handleDelete = async () => {
    if (deleteText.trim().toLowerCase() !== "delete") {
      return alert("Please type 'delete' to confirm.");
    }
    try {
      const res = await axiosInstance.delete(`/product/deleteProduct/${product._id}`);
      if (res.status === 200) {
        alert("Product deleted successfully");
        onClose();
        setTimeout(() => onProductDeleted(product._id), 100);
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert(error.response?.data?.message || "Error deleting product.");
    }
  };

  if (showUpdateModal) {
    return (
      <UpdateProductModal
        product={product}
        onClose={() => setShowUpdateModal(false)}
        onProductUpdated={onProductUpdated}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex justify-center items-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl relative">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 z-10 bg-white/50 backdrop-blur-lg w-12 h-12 flex justify-center items-center rounded-full shadow-lg hover:bg-red-200 transition"
        >
          <X size={26} className="text-gray-800" />
        </button>

        {/* Image Section (fixed height) */}
        <div className="relative w-full h-64 md:h-72 overflow-hidden rounded-t-3xl bg-black">
          {product.images?.length > 0 && (
            <img
              src={product.images[currentImage]}
              alt={product.title}
              className="w-full h-full object-contain bg-black"
            />
          )}

          {/* Arrows */}
          {product.images?.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/40 backdrop-blur-md text-gray-900 p-2 rounded-full hover:bg-white/70 transition"
              >
                <ChevronLeft size={22} />
              </button>

              <button
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/40 backdrop-blur-md text-gray-900 p-2 rounded-full hover:bg-white/70 transition"
              >
                <ChevronRight size={22} />
              </button>
            </>
          )}

          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {product.images?.map((_, i) => (
              <span
                key={i}
                className={`w-2.5 h-2.5 rounded-full ${
                  i === currentImage ? "bg-blue-600" : "bg-gray-300"
                }`}
              ></span>
            ))}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">

          <h2 className="text-2xl font-bold text-gray-800">{product.title}</h2>

          <p className="text-gray-600 whitespace-pre-line leading-relaxed">
            {product.description}
          </p>

          <p className="text-sm text-gray-500">
            <b>Category:</b> {product.category?.name || "Uncategorized"}
          </p>

          {/* Video Section */}
          {product.videos?.length > 0 && !removeVideo && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-800">Product Video</h3>

                {/* Remove video button */}
                <button
                  onClick={() => setRemoveVideo(true)}
                  className="p-1.5 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition"
                >
                  <Minus size={18} />
                </button>
              </div>

              <video
                src={product.videos[0]}
                controls
                className="w-full rounded-xl shadow-md"
              />
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={() => setShowUpdateModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Update
            </button>

            <button
              onClick={() => setConfirmDelete(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Delete
            </button>
          </div>

          {/* Delete Confirmation */}
          {confirmDelete && (
            <div className="mt-5 border-t pt-4 space-y-3 animate-fadeIn">
              <p className="text-red-600 font-medium">
                Type <b>delete</b> to confirm:
              </p>
              <input
                type="text"
                value={deleteText}
                onChange={(e) => setDeleteText(e.target.value)}
                className="border border-gray-300 rounded-lg w-full p-2 focus:ring-2 focus:ring-red-500 outline-none"
                placeholder="delete"
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setConfirmDelete(false);
                    setDeleteText("");
                  }}
                  className="px-3 py-1 border rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn .3s ease-in-out; }
      `}</style>
    </div>
  );
};

export default ProductModal;
