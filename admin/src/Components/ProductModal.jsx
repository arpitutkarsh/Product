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

  useEffect(() => {
    if (!product.images?.length) return;
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % product.images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [product.images]);

  const handleNext = () => setCurrentImage((prev) => (prev + 1) % product.images.length);
  const handlePrev = () => setCurrentImage((prev) => (prev - 1 + product.images.length) % product.images.length);

  const handleDelete = async () => {
    if (deleteText.trim().toLowerCase() !== "delete") return alert("Please type 'delete' to confirm.");
    try {
      const res = await axiosInstance.delete(`/product/delete/${product._id}`);
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

  if (showUpdateModal)
    return (
      <UpdateProductModal
        product={product}
        onClose={() => setShowUpdateModal(false)}
        onProductUpdated={onProductUpdated}
      />
    );

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center p-4 bg-black/40 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl relative flex flex-col md:flex-row overflow-hidden animate-slideUpMobile md:animate-fadeInDesktop">

        {/* Media Section */}
        <div className="w-full md:w-1/2 relative bg-black flex items-center justify-center md:max-h-[80vh] min-h-[250px]">
          {product.images?.length > 0 && (
            <img
              src={product.images[currentImage]}
              alt={product.title}
              className="w-full h-full object-contain"
            />
          )}

          {/* Arrows */}
          {product.images?.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 bg-white/30 backdrop-blur-md text-gray-900 p-2 rounded-full hover:bg-white/70 transition"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 bg-white/30 backdrop-blur-md text-gray-900 p-2 rounded-full hover:bg-white/70 transition"
              >
                <ChevronRight size={22} />
              </button>
            </>
          )}

          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {product.images?.map((_, i) => (
              <span key={i} className={`w-2 h-2 rounded-full ${i === currentImage ? "bg-blue-600" : "bg-gray-400"}`}></span>
            ))}
          </div>
        </div>

        {/* Content Section */}
        <div className="w-full md:w-1/2 p-6 max-h-[80vh] overflow-y-auto flex flex-col gap-4">

          {/* Close Button Large Screens */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 hidden md:flex bg-white/60 backdrop-blur-md w-10 h-10 items-center justify-center rounded-full shadow-md hover:bg-red-200 transition"
          >
            <X size={22} />
          </button>

          {/* Title & Description */}
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">{product.title}</h2>
          <p className="text-gray-600 whitespace-pre-line">{product.description}</p>
          <p className="text-sm text-gray-500">
            <b>Category:</b> {product.category?.name || "Uncategorized"}
          </p>

          {/* Video */}
          {product.videos?.length > 0 && !removeVideo && (
            <div>
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-800">Product Video</h3>
                <button
                  onClick={() => setRemoveVideo(true)}
                  className="p-1.5 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition"
                >
                  <Minus size={16} />
                </button>
              </div>
              <video src={product.videos[0]} controls className="w-full rounded-xl shadow mt-2" />
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-3 flex-wrap">
            <button
              onClick={() => setShowUpdateModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition w-full md:w-auto"
            >
              Update
            </button>

            <button
              onClick={() => setConfirmDelete(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition w-full md:w-auto"
            >
              Delete
            </button>
          </div>

          {/* Delete Confirmation */}
          {confirmDelete && (
            <div className="border-t pt-3 animate-fadeIn space-y-2">
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
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => { setConfirmDelete(false); setDeleteText(""); }}
                  className="px-3 py-1 border rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Confirm
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUpMobile { 0% { opacity: 0; transform: translateY(50px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInDesktop { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-fadeIn { animation: fadeIn .3s ease-in-out; }
        .animate-slideUpMobile { animation: slideUpMobile .4s ease-out; }
        .animate-fadeInDesktop { animation: fadeInDesktop .4s ease-out; }
      `}</style>
    </div>
  );
};

export default ProductModal;
