import React, { useEffect, useState } from "react";
import SideBar from "../Components/SideBar.jsx";
import axiosInstance from "../utils/axiosInstance.js";

const AddCategory = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get("/category/getCategory");
      setCategories(res.data.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      alert("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Add new category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return alert("Please enter a category name.");
    try {
      setLoading(true);
      const res = await axiosInstance.post("/category/addCategory", { name: newCategory });
      if (res.status === 200) {
        alert("Category added successfully!");
        setNewCategory("");
        fetchCategories();
      }
    } catch (error) {
      console.error("Add Category Error:", error);
      alert(error.response?.data?.message || "Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  // Delete category
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await axiosInstance.delete(`/category/deleteCategory/${id}`);
      alert("Category deleted successfully");
      setCategories(categories.filter((cat) => cat._id !== id));
    } catch (error) {
      console.error("Delete Error:", error);
      alert(error.response?.data?.message || "Failed to delete category");
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-50 relative">
      {/* Sidebar for mobile + desktop */}
      <SideBar />

      <div className="flex flex-1 flex-col p-4 sm:p-10 ml-0 sm:ml-72 transition-all duration-300">
        <h2 className="text-4xl font-extrabold mb-4 text-center text-gray-800">
          Manage Categories
        </h2>

        {/* Admin Note */}
        <div className="max-w-2xl mx-auto mb-6 bg-yellow-50 border border-yellow-300 rounded-xl p-4 shadow-sm">
          <p className="text-yellow-800 font-medium text-center">
            <strong>Note for Admin:</strong> Please do not delete existing categories to ensure seamless service for users.
          </p>
        </div>

        {/* Add Category Form */}
        <form
          onSubmit={handleAddCategory}
          className="flex flex-col sm:flex-row items-center gap-4 mb-6 bg-white shadow-xl rounded-2xl p-6 border border-gray-200 max-w-lg mx-auto"
        >
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Enter new category name"
            className="flex-1 border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 outline-none shadow-sm text-gray-700 font-medium"
          />
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-3 rounded-xl text-white font-bold text-lg transition shadow-md mt-2 sm:mt-0 ${
              loading
                ? "bg-purple-400 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
            }`}
          >
            {loading ? "Adding..." : "Add Category"}
          </button>
        </form>

        {/* Desktop Table */}
        <div className="hidden sm:block bg-white shadow-2xl rounded-3xl p-8 max-w-4xl mx-auto border border-gray-200">
          <h3 className="text-2xl font-bold mb-6 text-gray-800">Existing Categories</h3>
          {categories.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No categories found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse border border-gray-200">
                <thead className="bg-gradient-to-r from-purple-100 to-pink-100">
                  <tr>
                    <th className="border border-gray-300 px-6 py-3 text-left text-gray-700 font-semibold">#</th>
                    <th className="border border-gray-300 px-6 py-3 text-left text-gray-700 font-semibold">Category Name</th>
                    <th className="border border-gray-300 px-6 py-3 text-center text-gray-700 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat, index) => (
                    <tr key={cat._id} className="hover:bg-gray-50 transition cursor-pointer">
                      <td className="border border-gray-300 px-6 py-4 text-gray-800">{index + 1}</td>
                      <td className="border border-gray-300 px-6 py-4 text-gray-800 font-medium">{cat.name}</td>
                      <td className="border border-gray-300 px-6 py-4 text-center">
                        <button
                          onClick={() => handleDelete(cat._id)}
                          className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition shadow-md font-semibold"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Mobile Card View */}
        <div className="sm:hidden flex flex-col gap-4 mt-4">
          {categories.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No categories found.</p>
          ) : (
            categories.map((cat, index) => (
              <div key={cat._id} className="bg-white rounded-2xl shadow-lg p-4 flex justify-between items-center animate-slideUp">
                <span className="font-medium text-gray-800">{index + 1}. {cat.name}</span>
                <button
                  onClick={() => handleDelete(cat._id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition shadow-md font-semibold"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          0% { transform: translateY(30px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AddCategory;
