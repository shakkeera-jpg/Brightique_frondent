import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Product() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    stock: 0,
    image: "",
  });

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/products");
        setProducts(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  
  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.category || !newProduct.price || !newProduct.image) {
      alert("Please fill all fields");
      return;
    }

    const productToAdd = {
      ...newProduct,
      id: Date.now().toString(),
    };

    try {
      const res = await axios.post("http://localhost:5000/products", productToAdd);
      setProducts([res.data,...products]);
      setShowAddModal(false);
      setNewProduct({ name: "", category: "", price: "", stock: 0, image: "" });
    } catch (err) {
      console.error(err);
    }
  };

  
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`http://localhost:5000/products/${id}`);
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  
  const handleEdit = (product) => {
    setEditProduct({ ...product });
    setShowEditModal(true);
  };

  
  const handleSaveEdit = async () => {
    if (!editProduct.name || !editProduct.price || !editProduct.category) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await axios.patch(`http://localhost:5000/products/${editProduct.id}`, {
        name: editProduct.name,
        category: editProduct.category,
        price: editProduct.price,
        stock: editProduct.stock,
      });

      setProducts(products.map((p) => (p.id === editProduct.id ? res.data : p)));
      setShowEditModal(false);
      setEditProduct(null);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-amber-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-gray-800">Loading products...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen p-6 bg-amber-50">
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-600 text-sm">Manage your store’s inventory and pricing</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-lg shadow-md font-medium transition-all duration-200"
        >
          + Add Product
        </button>
      </div>

      <div className="overflow-x-auto">
      <div className="bg-white shadow-lg rounded-xl border border-amber-100">
        <table className="w-full text-sm text-gray-800">
          <thead className="bg-amber-500 text-white">
            <tr>
              <th className="px-6 py-3 text-left">Image</th>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Category</th>
              <th className="px-6 py-3 text-left">Price</th>
              <th className="px-6 py-3 text-left">Stock</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr
                key={p.id}
                className="border-b border-amber-100 hover:bg-amber-50 transition-colors duration-200"
              >
                <td className="px-6 py-3">
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-16 h-16 object-cover rounded-lg border border-amber-100"
                    />
                  ) : (
                    <span className="text-gray-500 italic">No Image</span>
                  )}
                </td>
                <td className="px-6 py-3 font-medium text-gray-900">{p.name}</td>
                <td className="px-6 py-3">{p.category}</td>
                <td className="px-6 py-3 text-amber-700 font-semibold">{formatPrice(p.price)}</td>
                <td className="px-6 py-3">
                  {p.stock > 0  ? (
                    p.stock <10 ? (
                    <span className="px-3 py-1 bg-yellow-200 text-yellow-700 text-sm font-medium rounded-full">
                      {p.stock}
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                      {p.stock}
                    </span>
                  )
                 ) : (
                    <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">
                      0
                    </span>
                  )}
                </td>
                <td className="px-6 py-3 text-center flex justify-center gap-2">
                  <button
                    onClick={() => handleEdit(p)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1.5 rounded-lg transition-all duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg transition-all duration-200"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div></div>

      
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-96 p-6 border border-amber-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Product</h2>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Product Name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                className="w-full border border-amber-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-400 outline-none"
              />
              <input
                type="text"
                placeholder="Category"
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                className="w-full border border-amber-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-400 outline-none"
              />
              <input
                type="number"
                placeholder="Price"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                className="w-full border border-amber-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-400 outline-none"
              />
              <input
                type="number"
                placeholder="Stock"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                className="w-full border border-amber-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-400 outline-none"
              />
              <input
                type="text"
                placeholder="Image URL"
                value={newProduct.image}
                onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                className="w-full border border-amber-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-400 outline-none"
              />

              {newProduct.image && (
                <img
                  src={newProduct.image}
                  alt="Preview"
                  className="w-20 h-20 object-cover mx-auto rounded-lg border mt-2"
                />
              )}
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProduct}
                className="px-4 py-2 rounded-lg bg-amber-500 text-white hover:bg-amber-600"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      
      {showEditModal && editProduct && (
        <div className="fixed inset-0 bg-black/50  bg-opacity-40 flex justify-center items-center z-40">
          <div className="bg-white rounded-xl shadow-2xl w-96 p-6 border border-amber-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Edit Product</h2>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Name"
                value={editProduct.name}
                onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                className="w-full border border-amber-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-400 outline-none"
              />
              <input
                type="text"
                placeholder="Category"
                value={editProduct.category}
                onChange={(e) => setEditProduct({ ...editProduct, category: e.target.value })}
                className="w-full border border-amber-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-400 outline-none"
              />
              <input
                type="number"
                placeholder="Price"
                value={editProduct.price}
                onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })}
                className="w-full border border-amber-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-400 outline-none"
              />
              <input
                type="number"
                placeholder="Stock"
                value={editProduct.stock}
                onChange={(e) => setEditProduct({ ...editProduct, stock: Number(e.target.value) })}
                className="w-full border border-amber-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-400 outline-none"
              />
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
