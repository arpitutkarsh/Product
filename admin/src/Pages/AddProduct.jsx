import React, { useState, useEffect } from "react";
import axios from "axios";
import SideBar from "../Components/SideBar.jsx";

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

  const BASE_URL = "https://backend-9lc5.onrender.com/api/ver1";

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/category/getCategory`, {
          withCredentials: true,
        });
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
    if (name === "images") setImages([...files]);
    if (name === "videos") setVideos([...files]);
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
      alert("Please fill in all required fields.");
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    images.forEach((img) => data.append("images", img));
    videos.forEach((vid) => data.append("videos", vid));

    try {
      setLoading(true);
      const res = await axios.post(`${BASE_URL}/product/addProduct`, data, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (res.status === 201) {
        alert("✅ Product added successfully!");
        setFormData({
          title: "",
          description: "",
          productId: "",
          link: "",
          category: "",
        });
        setImages([]);
        setVideos([]);
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert(error.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  // Render image/video previews with hover minus button
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

            {/* Important Notes */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-xl mb-8 shadow-md">
              <h3 className="text-xl font-semibold text-yellow-700 mb-4">
                ⚠ Important Notes
              </h3>
              <ul className="list-decimal list-inside space-y-2 text-gray-700 text-sm">
                <li><strong>Product ID:</strong> Must be unique for each product.</li>
                <li><strong>Images:</strong> Minimum resolution of <strong>800x800px</strong>.</li>
                <li><strong>Videos:</strong> Max resolution <strong>720p</strong>.</li>
                <li><strong>File Limits:</strong> Up to <strong>10 images</strong> & <strong>10 videos</strong>.</li>
                <li><strong>Accepted Image Formats:</strong> JPG, JPEG, PNG, WEBP.</li>
                <li><strong>Accepted Video Formats:</strong> MP4, MOV, AVI.</li>
                <li><strong>Max File Size:</strong> 15MB per file.</li>
                <li><strong>Category:</strong> Select accurately.</li>
                <li><strong>Tip:</strong> High-quality media improves visibility & trust.</li>
                <li><strong>Warning:</strong> Wrong formats or exceeding limits may fail uploads.</li>
              </ul>
              <p className="mt-3 text-xs italic text-yellow-800">
                Tip: Use descriptive filenames like <strong>red_shoe_01.jpg</strong>.
              </p>
            </div>

            {/* Inputs */}
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
