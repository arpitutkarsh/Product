import React, { useEffect, useState } from "react";
import axios from "axios";
import SideBar from "../Components/SideBar.jsx";

const AddCategory = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/ver1/category/getCategory",
        { withCredentials: true }
      );
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
      const res = await axios.post(
        "http://localhost:8000/api/ver1/category/addCategory",
        { name: newCategory },
        { withCredentials: true }
      );

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
      await axios.delete(
        `http://localhost:8000/api/ver1/category/deleteCategory/${id}`,
        { withCredentials: true }
      );
      alert("Category deleted successfully");
      setCategories(categories.filter((cat) => cat._id !== id));
    } catch (error) {
      console.error("Delete Error:", error);
      alert(error.response?.data?.message || "Failed to delete category");
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-50">
      <SideBar />

      <div className="flex flex-col flex-1 p-10">
        <h2 className="text-4xl font-extrabold mb-4 text-center text-gray-800">
          Manage Categories
        </h2>

        {/* 📝 Admin Note */}
        <div className="max-w-2xl mx-auto mb-8 bg-yellow-50 border border-yellow-300 rounded-xl p-4 shadow-sm">
          <p className="text-yellow-800 font-medium text-center">
             <strong>Note for Admin:</strong> Please do not delete existing categories 
            to ensure seamless service for users and avoid data inconsistency.
          </p>
        </div>

        {/* Add Category Form */}
        <form
          onSubmit={handleAddCategory}
          className="flex items-center gap-4 mb-10 bg-white shadow-xl rounded-2xl p-6 border border-gray-200 max-w-lg mx-auto"
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
            className={`px-6 py-3 rounded-xl text-white font-bold text-lg transition shadow-md ${
              loading
                ? "bg-purple-400 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
            }`}
          >
            {loading ? "Adding..." : "Add Category"}
          </button>
        </form>

        {/* Category Table */}
        <div className="bg-white shadow-2xl rounded-3xl p-8 max-w-4xl mx-auto border border-gray-200">
          <h3 className="text-2xl font-bold mb-6 text-gray-800">Existing Categories</h3>

          {categories.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No categories found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse border border-gray-200">
                <thead className="bg-gradient-to-r from-purple-100 to-pink-100">
                  <tr>
                    <th className="border border-gray-300 px-6 py-3 text-left text-gray-700 font-semibold">
                      #
                    </th>
                    <th className="border border-gray-300 px-6 py-3 text-left text-gray-700 font-semibold">
                      Category Name
                    </th>
                    <th className="border border-gray-300 px-6 py-3 text-center text-gray-700 font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat, index) => (
                    <tr
                      key={cat._id}
                      className="hover:bg-gray-50 transition cursor-pointer"
                    >
                      <td className="border border-gray-300 px-6 py-4 text-gray-800">{index + 1}</td>
                      <td className="border border-gray-300 px-6 py-4 text-gray-800 font-medium">
                        {cat.name}
                      </td>
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
      </div>
    </div>
  );
};

export default AddCategory;
