import React, { useState } from "react";
import axios from "axios";

const UpdateProductModal = ({ product, onClose, onProductUpdated }) => {
  const [formData, setFormData] = useState({
    title: product.title || "",
    description: product.description || "",
    category: product.category?._id || "",
    link: product.link || "",
  });

  const [newImages, setNewImages] = useState([]);
  const [newVideos, setNewVideos] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [videosToDelete, setVideosToDelete] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageProgress, setImageProgress] = useState(0);
  const [videoProgress, setVideoProgress] = useState(0);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setImageProgress(0);
    setVideoProgress(0);

    try {
      const updateForm = new FormData();
      updateForm.append("title", formData.title);
      updateForm.append("description", formData.description);
      updateForm.append("category", formData.category);
      updateForm.append("link", formData.link);

      updateForm.append("deleteImages", JSON.stringify(imagesToDelete));
      updateForm.append("deleteVideos", JSON.stringify(videosToDelete));

      newImages.forEach((img) => updateForm.append("images", img));
      newVideos.forEach((vid) => updateForm.append("videos", vid));

      const res = await axios.put(
        `https://backend-9lc5.onrender.com/api/ver1/product/${product._id}`,
        updateForm,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
          onUploadProgress: (progressEvent) => {
            const total = progressEvent.total || 1;
            const percent = Math.round((progressEvent.loaded * 100) / total);
            if (newImages.length && !newVideos.length) setImageProgress(percent);
            else if (newVideos.length && !newImages.length) setVideoProgress(percent);
            else {
              setImageProgress(percent / 2);
              setVideoProgress(percent / 2);
            }
          },
        }
      );

      alert("✅ Product updated successfully");
      onProductUpdated(res.data.data);
      onClose();
    } catch (error) {
      console.error("❌ Update error:", error);
      alert(error.response?.data?.message || "Error updating product");
    } finally {
      setLoading(false);
      setTimeout(() => {
        setImageProgress(0);
        setVideoProgress(0);
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 p-4 backdrop-blur-sm bg-black/40">
      <div className="w-full max-w-md md:max-w-lg bg-pink-200/20 backdrop-blur-xl border border-pink-300/30 rounded-3xl shadow-2xl p-6 overflow-y-auto max-h-[90vh] relative scrollbar-hide">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-100 hover:text-white transition"
          disabled={loading}
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center text-white tracking-wide">
          {loading ? "Updating Product..." : "Update Product"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-white">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Product Title"
            className="border border-white/30 bg-white/10 backdrop-blur-sm p-3 rounded-lg placeholder-gray-200 focus:ring-2 focus:ring-pink-400 outline-none transition"
            disabled={loading}
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Product Description"
            className="border border-white/30 bg-white/10 backdrop-blur-sm p-3 rounded-lg placeholder-gray-200 focus:ring-2 focus:ring-pink-400 outline-none transition"
            disabled={loading}
          />

          <input
            type="text"
            name="link"
            value={formData.link}
            onChange={handleChange}
            placeholder="Product Link"
            className="border border-white/30 bg-white/10 backdrop-blur-sm p-3 rounded-lg placeholder-gray-200 focus:ring-2 focus:ring-pink-400 outline-none transition"
            disabled={loading}
          />

          {/* Existing images with glass hover effect */}
          {product.images?.length > 0 && (
            <div>
              <p className="font-semibold mb-2 text-white">Current Images</p>
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((img) => (
                  <div
                    key={img}
                    className="relative w-20 h-20 rounded-lg overflow-hidden border border-white/30 backdrop-blur-md hover:scale-105 hover:shadow-lg transition-transform"
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      disabled={loading}
                      onClick={() =>
                        setImagesToDelete((prev) =>
                          prev.includes(img)
                            ? prev.filter((i) => i !== img)
                            : [...prev, img]
                        )
                      }
                      className={`absolute top-1 right-1 text-xs px-2 py-1 rounded ${
                        imagesToDelete.includes(img)
                          ? "bg-red-600 text-white"
                          : "bg-white/80 text-black border"
                      }`}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload new images */}
          <label className="font-semibold mt-2 text-white">Add New Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setNewImages([...e.target.files])}
            className="border border-white/30 bg-white/10 backdrop-blur-sm p-2 rounded-lg"
            disabled={loading}
          />
          {loading && imageProgress > 0 && (
            <div>
              <p className="text-sm mb-1 text-white/80">Image Upload: {imageProgress}%</p>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div
                  className="bg-pink-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${imageProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Upload new videos */}
          <label className="font-semibold mt-4 text-white">Add New Videos</label>
          <input
            type="file"
            multiple
            accept="video/*"
            onChange={(e) => setNewVideos([...e.target.files])}
            className="border border-white/30 bg-white/10 backdrop-blur-sm p-2 rounded-lg"
            disabled={loading}
          />
          {loading && videoProgress > 0 && (
            <div>
              <p className="text-sm mb-1 text-white/80">Video Upload: {videoProgress}%</p>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div
                  className="bg-pink-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${videoProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`mt-4 px-4 py-2 rounded-lg text-white font-semibold shadow-lg transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-pink-500 to-pink-400 hover:from-pink-600 hover:to-pink-500"
            }`}
          >
            {loading ? "Uploading..." : "Save Changes"}
          </button>
        </form>
      </div>

      {/* Hide scrollbar with tailwind plugin */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default UpdateProductModal;
