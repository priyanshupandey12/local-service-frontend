import { useState, useEffect } from "react";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/adminService";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
const [categoryImage, setCategoryImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    basePrice: "",
    isActive: true,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await getAllCategories();
      setCategories(response.categories);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({ name: "", description: "", basePrice: "", isActive: true });
      setCategoryImage(null);
    setError("");
    setShowModal(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      basePrice: category.basePrice,
      isActive: category.isActive,
    });
      setCategoryImage(null);
    setError("");
    setShowModal(true);
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setActionLoading(true);
  try {
    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("basePrice", formData.basePrice);
    data.append("isActive", formData.isActive);
    if (categoryImage) data.append("image", categoryImage);

    if (editingCategory) {
      await updateCategory(editingCategory._id, data);
    } else {
      await createCategory(data);
    }
    await fetchCategories();
    setShowModal(false);
  } catch (err) {
    setError(err.response?.data?.message || "Something went wrong");
  } finally {
    setActionLoading(false);
  }
};

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
    
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Category Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage service categories for your providers</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-black text-white text-sm px-5 py-2.5 rounded-lg hover:bg-gray-900 transition"
        >
          + Add New Category
        </button>
      </div>

   
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      
        <div className="grid grid-cols-5 px-6 py-3 border-b border-gray-100 bg-gray-50">
          <p className="text-xs font-semibold text-gray-500 uppercase col-span-2">Category Name</p>
          <p className="text-xs font-semibold text-gray-500 uppercase">Base Price</p>
          <p className="text-xs font-semibold text-gray-500 uppercase">Status</p>
          <p className="text-xs font-semibold text-gray-500 uppercase text-right">Actions</p>
        </div>

       
        {loading ? (
          <div className="text-center text-gray-400 py-10">Loading...</div>
        ) : categories.length === 0 ? (
          <div className="text-center text-gray-400 py-10">No categories found</div>
        ) : (
          categories.map((category) => (
            <div
              key={category._id}
              className="grid grid-cols-5 px-6 py-4 border-b border-gray-100 items-center hover:bg-gray-50 transition"
            >
              
              <div className="col-span-2">
                <p className="text-sm font-medium text-gray-900">{category.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{category.description}</p>
              </div>

          
              <p className="text-sm text-gray-700">₹{category.basePrice}</p>

             
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium w-fit ${category.isActive ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                {category.isActive ? "Active" : "Inactive"}
              </span>

              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => openEditModal(category)}
                  className="border border-gray-300 text-gray-600 text-xs px-4 py-1.5 rounded-lg hover:bg-gray-50 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(category._id)}
                  className="border border-red-200 text-red-500 text-xs px-4 py-1.5 rounded-lg hover:bg-red-50 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

   
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg">

            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {editingCategory ? "Edit Category" : "Add New Category"}
            </h2>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Category name"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-black transition"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Category description"
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-black transition resize-none"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Base Price (₹)</label>
                <input
                  type="number"
                  value={formData.basePrice}
                  onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                  placeholder="Enter base price"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-black transition"
                />
              </div>

              <div>
           <label className="text-sm font-medium text-gray-700 block mb-1">
              Image <span className="text-gray-400">(optional)</span>
                   </label>
                   <input
                    type="file"
                  accept="image/*"
              onChange={(e) => setCategoryImage(e.target.files[0])}
             className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm"
                 />
                  </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 accent-black"
                />
                <label htmlFor="isActive" className="text-sm text-gray-700">Active</label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 border border-gray-300 text-gray-600 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 bg-black text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-900 transition disabled:opacity-50"
                >
                  {actionLoading ? "Please wait..." : editingCategory ? "Update" : "Create"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminCategories;