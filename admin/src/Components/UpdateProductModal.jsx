import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance.js";

const UpdateProductModal = ({ product, onClose, onProductUpdated }) => {
  const [formData, setFormData] = useState({
    title: product.title || "",
    description: product.description || "",
    category: product.category?._id || "",
    link: product.link || "",
  });

  const [categories, setCategories] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [newVideos, setNewVideos] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [videosToDelete, setVideosToDelete] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageProgress, setImageProgress] = useState(0);
  const [videoProgress, setVideoProgress] = useState(0);
  const [step, setStep] = useState(0);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get("/category/getCategory");
        setCategories(res.data.data || []);
      } catch (err) {
        console.error("Failed to load categories", err);
        alert("Failed to fetch categories");
      }
    };
    fetchCategories();
  }, []);

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

      const res = await axiosInstance.put(`/product/${product._id}`, updateForm, {
        headers: { "Content-Type": "multipart/form-data" },
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
      });

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

  const renderPreviews = (files, type, setFiles) => {
    if (!files.length) return null;
    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {files.map((file, idx) => (
          <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-white/30 hover:scale-105 transition-transform">
            {type === "image" ? (
              <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
            ) : (
              <video src={URL.createObjectURL(file)} controls className="w-full h-full object-cover" />
            )}
            <button
              type="button"
              disabled={loading}
              onClick={() => setFiles(files.filter((_, i) => i !== idx))}
              className="absolute top-1 right-1 bg-red-600 text-white w-5 h-5 flex items-center justify-center text-xs rounded-full"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    );
  };

  // Mobile steps
  const steps = [
    {
      title: "Basic Info",
      content: (
        <>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title"
            className="w-full p-3 rounded-lg border border-white/30 mb-3"
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            rows={3}
            className="w-full p-3 rounded-lg border border-white/30"
          />
        </>
      ),
    },
    {
      title: "Category & Link",
      content: (
        <>
          <input
            type="text"
            name="link"
            value={formData.link}
            onChange={handleChange}
            placeholder="Product Link"
            className="w-full p-3 rounded-lg border border-white/30 mb-3"
          />
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border border-white/30"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </>
      ),
    },
    {
      title: "Media",
      content: (
        <>
          <label className="font-semibold mt-2">New Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setNewImages([...e.target.files])}
            className="w-full p-2 rounded-lg border border-white/30 mb-2"
          />
          {renderPreviews(newImages, "image", setNewImages)}

          <label className="font-semibold mt-4">New Videos</label>
          <input
            type="file"
            multiple
            accept="video/*"
            onChange={(e) => setNewVideos([...e.target.files])}
            className="w-full p-2 rounded-lg border border-white/30 mb-2"
          />
          {renderPreviews(newVideos, "video", setNewVideos)}
        </>
      ),
    },
  ];

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose}></div>

      {/* Desktop modal */}
      <div className="hidden sm:flex fixed inset-0 z-50 justify-center items-center p-4">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-6 w-full max-w-lg overflow-y-auto max-h-[90vh] relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-600 hover:text-black">
            ✕
          </button>
          <h2 className="text-2xl font-bold mb-4 text-center">Update Product</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Title" className="w-full p-3 rounded-lg border border-gray-300" />
            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" rows={3} className="w-full p-3 rounded-lg border border-gray-300" />
            <input type="text" name="link" value={formData.link} onChange={handleChange} placeholder="Link" className="w-full p-3 rounded-lg border border-gray-300" />
            <select name="category" value={formData.category} onChange={handleChange} className="w-full p-3 rounded-lg border border-gray-300">
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <button type="submit" disabled={loading} className="mt-4 py-2 bg-pink-500 rounded-lg text-white font-bold hover:bg-pink-600 transition">
              {loading ? "Updating..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>

      {/* Mobile slide-up modal */}
      <div className={`sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg rounded-t-3xl shadow-2xl p-4 transform transition-transform duration-500`}>
        <h2 className="text-xl font-bold text-center mb-3">{steps[step].title}</h2>
        {steps[step].content}
        <div className="flex justify-between mt-4">
          <button
            disabled={step === 0}
            onClick={() => setStep(step - 1)}
            className="px-4 py-2 bg-gray-300 rounded-lg"
          >
            Back
          </button>
          {step < steps.length - 1 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-4 mr-20 py-2 bg-pink-500 text-white rounded-lg"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`px-4 py-2 rounded-lg text-white ${loading ? "bg-gray-400" : "bg-gradient-to-r from-pink-500 to-pink-400"}`}
            >
              {loading ? "Uploading..." : "Submit"}
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default UpdateProductModal;
