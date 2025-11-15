import React, { useState, useEffect } from "react";
import SideBar from "../Components/SideBar.jsx";
import axiosInstance from "../utils/axiosInstance.js";

const AddProduct = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    productId: "",
    link: "",
    category: "",
  });
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageProgress, setImageProgress] = useState(0);
  const [videoProgress, setVideoProgress] = useState(0);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get("/category/getCategory");
        setCategories(res.data.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        alert("Failed to load categories.");
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const { name, files } = e.target;

    if (name === "images") {
      if (files.length > 10) return alert("Max 10 images allowed");
      setImages([...files]);
    }

    if (name === "videos") {
      if (files.length > 10) return alert("Max 10 videos allowed");
      setVideos([...files]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.description ||
      !formData.productId ||
      !formData.link ||
      !formData.category
    ) {
      return alert("Please fill in all required fields.");
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    images.forEach((img) => data.append("images", img));
    videos.forEach((vid) => data.append("videos", vid));

    try {
      setLoading(true);
      setImageProgress(0);
      setVideoProgress(0);

      const res = await axiosInstance.post("/product/addProduct", data, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const total = progressEvent.total || 1;
          const percent = Math.round((progressEvent.loaded * 100) / total);

          if (images.length && !videos.length) setImageProgress(percent);
          else if (videos.length && !images.length) setVideoProgress(percent);
          else {
            setImageProgress(percent / 2);
            setVideoProgress(percent / 2);
          }
        },
      });

      if (res.status === 201) {
        alert("✅ Product added successfully!");
        setFormData({ title: "", description: "", productId: "", link: "", category: "" });
        setImages([]);
        setVideos([]);
        setImageProgress(0);
        setVideoProgress(0);
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert(error.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  const renderPreviews = (files, type, setFiles) => {
    if (!files.length) return null;
    return (
      <div className="flex flex-wrap gap-4 mt-3">
        {files.map((file, index) => (
          <div
            key={index}
            className="relative group border rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300"
          >
            {type === "image" ? (
              <img
                src={URL.createObjectURL(file)}
                alt={`preview-${index}`}
                className="w-28 h-28 object-cover"
              />
            ) : (
              <video
                src={URL.createObjectURL(file)}
                controls
                className="w-32 h-28 object-cover"
              />
            )}

            <button
              type="button"
              onClick={() => {
                const updatedFiles = files.filter((_, i) => i !== index);
                setFiles(updatedFiles);
              }}
              className="absolute top-1 right-1 bg-red-600 text-white w-6 h-6 flex items-center justify-center rounded-full text-xs shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              &minus;
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-gray-100 via-gray-50 to-gray-100">
      <SideBar />

      <div className="flex flex-1 justify-center items-start p-8">
        <div className="w-full max-w-3xl">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-200"
          >
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
              Add New Product
            </h2>

            <div className="space-y-4">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Product Title"
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 outline-none shadow-sm"
                required
              />

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Product Description"
                rows="4"
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 outline-none shadow-sm"
                required
              ></textarea>

              <input
                type="text"
                name="productId"
                value={formData.productId}
                onChange={handleChange}
                placeholder="Product ID"
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 outline-none shadow-sm"
                required
              />

              <input
                type="text"
                name="link"
                value={formData.link}
                onChange={handleChange}
                placeholder="Product Link"
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 outline-none shadow-sm"
                required
              />

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 outline-none shadow-sm"
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <div>
                <label className="block mb-2 font-medium">Upload Images</label>
                <input
                  type="file"
                  name="images"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="w-full border border-gray-300 rounded-xl p-3"
                />
                {renderPreviews(images, "image", setImages)}
                {loading && imageProgress > 0 && (
                  <p className="text-sm text-gray-700 mt-1">Uploading Images: {imageProgress}%</p>
                )}
              </div>

              <div>
                <label className="block mb-2 font-medium mt-4">Upload Videos</label>
                <input
                  type="file"
                  name="videos"
                  accept="video/*"
                  multiple
                  onChange={handleFileChange}
                  className="w-full border border-gray-300 rounded-xl p-3"
                />
                {renderPreviews(videos, "video", setVideos)}
                {loading && videoProgress > 0 && (
                  <p className="text-sm text-gray-700 mt-1">Uploading Videos: {videoProgress}%</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`mt-8 w-full py-3 rounded-2xl text-white font-bold text-lg transition shadow-lg ${
                loading
                  ? "bg-purple-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
              }`}
            >
              {loading ? "Adding Product..." : "Add Product"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
