"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import {
  useGetAllProductsAdminQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUploadProductImageMutation,
} from "@/redux/slices/adminApi.slice";

export default function AdminProductsPage() {
  const defaultForm = {
    name: "",
    description: "",
    category: "",
    price: "",
    stock: "",
    unit: "",
    image: "",
    status: "In Stock",
  };

  const [formData, setFormData] = useState(defaultForm);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const {
    data: productsData,
    error,
    isLoading: loading,
    refetch,
  } = useGetAllProductsAdminQuery();
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const [uploadImage, { isLoading: isUploading }] =
    useUploadProductImageMutation();

  const products = productsData || [];

  if (error) {
    toast.error("Error fetching products. Is backend running?");
  }

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to upload images");
      return;
    }

    if (!formData.name || !formData.category) {
      toast.error(
        "Please enter a product name and select a category before uploading an image"
      );
      e.target.value = null; // reset input
      return;
    }

    const formDataUpload = new FormData();
    formDataUpload.append("name", formData.name);
    formDataUpload.append("category", formData.category);
    formDataUpload.append("image", file);

    try {
      const res = await uploadImage(formDataUpload).unwrap();
      setFormData((prev) => ({ ...prev, image: res.url }));
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error(error);
      toast.error(
        `Upload failed: ${error.data?.message || "Error uploading image"}`
      );
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const productData = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
      };

      if (editingProductId) {
        await updateProduct({
          id: editingProductId,
          data: productData,
        }).unwrap();
      } else {
        await createProduct(productData).unwrap();
      }

      toast.success(
        `Product ${editingProductId ? "updated" : "added"} successfully`
      );
      setShowAddForm(false);
      setEditingProductId(null);
      setFormData(defaultForm);
    } catch (error) {
      console.error(error);
      toast.error(
        `Failed to save product: ${error.data?.message || "Unknown error"}`
      );
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      description: product.description || "",
      category: product.category,
      price: product.price,
      stock: product.stock,
      unit: product.unit,
      image: product.image || "",
      status: product.status,
    });
    setEditingProductId(product._id);
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await deleteProduct(deleteConfirmId).unwrap();
      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error("Error deleting product");
    } finally {
      setDeleteConfirmId(null);
    }
  };

  return (
    <>
      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-sm w-full border border-primary/10">
            <h3 className="text-xl font-bold text-primary mb-2">
              Delete Product
            </h3>
            <p className="text-primary/70 mb-6">
              Are you sure you want to delete this product? This action cannot
              be undone.
            </p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-5 py-2.5 rounded-xl font-bold text-primary/70 hover:bg-primary/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-5 py-2.5 rounded-xl font-bold text-white bg-blue-500 hover:bg-blue-600 transition-colors shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Product Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl border border-primary/10 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-primary/10 flex justify-between items-center bg-primary/5">
              <h2 className="text-xl font-bold text-primary">
                {editingProductId ? "Edit Product" : "Add New Product"}
              </h2>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingProductId(null);
                  setFormData(defaultForm);
                }}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary/60 hover:text-red-500 hover:bg-red-500/10 transition-colors shadow-sm border border-primary/10"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <form
                id="productForm"
                onSubmit={handleAddProduct}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-primary/80">
                      Name
                    </label>
                    <input
                      required
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-2.5 border border-primary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
                      placeholder="Product Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-primary/80">
                      Category
                    </label>
                    <select
                      required
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full p-2.5 border border-primary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm bg-white"
                    >
                      <option value="">Select Category</option>
                      <option value="vegetables">Vegetables</option>
                      <option value="fruits">Fruits</option>
                      <option value="grains">Grains</option>
                      <option value="greens">Greens</option>
                      <option value="pulses-nuts">Pulses & Nuts</option>
                      <option value="fodder">Fodder</option>
                      <option value="seeds">Seeds</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-primary/80">
                      Price (₹)
                    </label>
                    <input
                      required
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full p-2.5 border border-primary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
                      placeholder="Price"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-primary/80">
                      Unit
                    </label>
                    <select
                      required
                      name="unit"
                      value={formData.unit}
                      onChange={handleInputChange}
                      className="w-full p-2.5 border border-primary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm bg-white"
                    >
                      <option value="kg">kg</option>
                      <option value="bunch">bunch</option>
                      <option value="dozen">dozen</option>
                      <option value="liter">liter</option>
                      <option value="piece">piece</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-primary/80">
                      Stock
                    </label>
                    <input
                      required
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      className="w-full p-2.5 border border-primary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
                      placeholder="Available Stock"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-primary/80">
                      Status
                    </label>
                    <select
                      required
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full p-2.5 border border-primary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm bg-white"
                    >
                      <option value="Active">Active</option>
                      <option value="Out of Stock">Out of Stock</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1 text-primary/80">
                      Benefits / Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full p-2.5 border border-primary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
                      rows="3"
                      placeholder="Enter the product benefits (e.g. 100% Organic, Freshly picked)"
                    ></textarea>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1 text-primary/80">
                      Product Image
                    </label>
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                      {formData.image && (
                        <div className="w-16 h-16 rounded-xl border border-primary/20 overflow-hidden relative flex-shrink-0 bg-primary/5">
                          <Image
                            src={formData.image}
                            alt="Preview"
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      )}
                      <div className="flex-1 w-full space-y-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="w-full text-sm text-primary/70 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-colors cursor-pointer"
                        />
                        <input
                          type="url"
                          name="image"
                          value={formData.image}
                          onChange={handleInputChange}
                          className="w-full p-2.5 border border-primary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm bg-primary/5"
                          placeholder="Or paste image URL here (https://...)"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div className="p-4 border-t border-primary/10 bg-primary/5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingProductId(null);
                  setFormData(defaultForm);
                }}
                className="px-6 py-2.5 bg-white text-primary/70 font-bold rounded-xl hover:bg-primary/5 border border-primary/10 transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="productForm"
                disabled={isUploading}
                className="px-6 py-2.5 bg-accent text-white font-bold rounded-xl hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm shadow-accent/20"
              >
                {isUploading
                  ? "Uploading Image..."
                  : editingProductId
                    ? "Update Product"
                    : "Save Product"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6 animate-fade-in">
        <div className="bg-white rounded-2xl shadow-sm border border-primary/10 overflow-hidden">
          <div className="p-4 border-b border-primary/10 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <input
              type="text"
              placeholder="Search products by name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-80 bg-primary/5 border border-primary/10 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
            <button
              onClick={() => {
                if (showAddForm) {
                  setShowAddForm(false);
                  setEditingProductId(null);
                  setFormData(defaultForm);
                } else {
                  setShowAddForm(true);
                }
              }}
              className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-white font-bold py-2.5 px-6 rounded-xl transition-colors shadow-lg shadow-accent/20 flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {showAddForm ? (
                "Cancel"
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M5 12h14" />
                    <path d="M12 5v14" />
                  </svg>
                  Add Product
                </>
              )}
            </button>
          </div>

          <div className="overflow-x-auto overflow-y-auto max-h-[74vh]">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead className="sticky top-0 z-10 bg-white shadow-sm">
                <tr className="bg-primary/5 border-b border-primary/10 text-primary/70 text-xs uppercase tracking-wider font-semibold">
                  <th className="py-4 px-6">Product</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Price</th>
                  <th className="py-4 px-6">Stock</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="py-8 text-center text-primary/60"
                    >
                      Loading products...
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="py-8 text-center text-primary/60"
                    >
                      No products found. Add some!
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr
                      key={product._id}
                      className="border-b border-primary/5 hover:bg-primary/5 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden relative">
                            {product.image ? (
                              <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                className="text-primary/50"
                              >
                                <rect
                                  x="3"
                                  y="3"
                                  width="18"
                                  height="18"
                                  rx="2"
                                  ry="2"
                                />
                                <circle cx="8.5" cy="8.5" r="1.5" />
                                <polyline points="21 15 16 10 5 21" />
                              </svg>
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-sm text-primary">
                              {product.name}
                            </div>
                            <div className="text-xs text-primary/60">
                              {product._id?.substring(0, 8)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-primary/60 capitalize">
                        {product.category}
                      </td>
                      <td className="py-4 px-6">
                        {product.category === "greens" ? (
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-primary">
                              ₹{Math.round(product.price * 0.8)}/{product.unit}
                              <span className="ml-2 px-1.5 py-0.5 bg-accent text-white text-[10px] uppercase font-bold rounded-full shadow-sm">
                                20% Off
                              </span>
                            </span>
                            <span className="text-xs text-primary/40 line-through">
                              ₹{product.price}/{product.unit}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm font-semibold text-primary">
                            ₹{product.price}/{product.unit}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm font-medium">
                          {product.stock}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            product.status === "Active"
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                              : product.status === "Out of Stock"
                                ? "bg-red-500/10 text-red-600 border-red-500/20"
                                : "bg-primary/10 text-primary/60 border-primary/20"
                          }`}
                        >
                          {product.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-primary/50 hover:text-primary/80 hover:text-primary transition-colors p-2"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          >
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="text-primary/50 hover:text-blue-500 transition-colors p-2"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          >
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
