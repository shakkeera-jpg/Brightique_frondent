import React, { useState, useEffect } from "react";
import api from "../../api/axios";

export default function Product() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
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
        const res = await api.get("admin/products/", {
          params: { page, search, category },
        });
        setProducts(res.data.results);
        setNextPage(res.data.next);
        setPrevPage(res.data.previous);
        setTotalPages(res.data.total_pages);
      } catch (err) {
        console.error("Fetch products error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [page, search, category]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("admin/categories/");
        setCategories(res.data);
      } catch (err) {
        console.error("Fetch categories error:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.category || !newProduct.price || !newProduct.image) {
      alert("Please fill all fields");
      return;
    }
    try {
      const res = await api.post("admin/products/", { ...newProduct, price: Number(newProduct.price) });
      setProducts([res.data, ...products]);
      setShowAddModal(false);
      setNewProduct({ name: "", category: "", price: "", stock: 0, image: "", warranty: "", size: "", material: "" });
    } catch (err) {
      console.error("Add product error:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`admin/products/${id}/`);
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Delete product error:", err);
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
      const res = await api.patch(`admin/products/${editProduct.id}/`, {
        name: editProduct.name,
        category: editProduct.category,
        price: Number(editProduct.price),
        stock: editProduct.stock,
        image: editProduct.image,
        warranty: editProduct.warranty,
        size: editProduct.size,
        material: editProduct.material,
      });
      setProducts(products.map((p) => (p.id === editProduct.id ? res.data : p)));
      setShowEditModal(false);
      setEditProduct(null);
    } catch (err) {
      console.error("Edit product error:", err);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="flex flex-col items-center">
          <div className="h-10 w-10 border-2 border-gray-100 border-t-[#AF8F42] rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400 font-bold tracking-[0.3em] uppercase text-[9px]">Syncing Inventory</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-gray-800 p-8">
     
      <div className="max-w-7xl mx-auto mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-[10px] tracking-[0.4em] uppercase text-[#AF8F42] mb-2 font-bold">Boutique Assets</p>
            <h1 className="text-4xl font-serif text-gray-900 tracking-tight">Products</h1>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="text"
              placeholder="SEARCH CATALOG..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="bg-gray-50 border border-gray-200 px-5 py-3 rounded-xl text-[10px] tracking-[0.2em] uppercase text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#AF8F42]/30 transition-all w-64"
            />

            <select
              value={category}
              onChange={(e) => { setCategory(e.target.value); setPage(1); }}
              className="bg-white border border-gray-200 px-4 py-3 rounded-xl text-[10px] tracking-[0.2em] uppercase text-gray-500 outline-none cursor-pointer"
            >
              <option value="">ALL COLLECTIONS</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>

            <button
              onClick={() => setShowAddModal(true)}
              className="bg-[#AF8F42] hover:bg-[#967a38] text-white px-8 py-3 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all shadow-lg shadow-[#AF8F42]/20 active:scale-95"
            >
              New Entry
            </button>
          </div>
        </div>
        <div className="h-px w-full bg-gray-100 mt-8" />
      </div>

      
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-sm rounded-3xl border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Asset</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Collection</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Valuation</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Registry</th>
                <th className="px-8 py-5 text-right text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/50 transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-5">
                      <div className="h-14 w-14 rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0">
                        {p.image ? (
                          <img src={p.image} alt={p.name} className="h-full w-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-500" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-[9px] text-gray-300 italic tracking-widest uppercase">Null</div>
                        )}
                      </div>
                      <span className="text-[12px] font-bold text-gray-800 tracking-wider uppercase">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-[11px] text-gray-500 uppercase tracking-widest">{p.category}</td>
                  <td className="px-8 py-6 text-[13px] font-serif text-gray-900">{formatPrice(p.price)}</td>
                  <td className="px-8 py-6">
                    <span className={`text-[9px] font-bold tracking-[0.2em] uppercase px-3 py-1 rounded-full border ${
                        p.stock > 10 ? 'border-emerald-100 text-emerald-600' : 
                        p.stock > 0 ? 'border-amber-100 text-amber-600' : 
                        'border-rose-100 text-rose-400'
                      }`}>
                      {p.stock === 0 ? "Depleted" : `In Stock: ${p.stock}`}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-6">
                      <button onClick={() => handleEdit(p)} className="text-[10px] font-bold text-gray-400 hover:text-[#AF8F42] uppercase tracking-[0.2em] transition-colors">Edit</button>
                      <button onClick={() => handleDelete(p.id)} className="text-[10px] font-bold text-gray-400 hover:text-rose-400 uppercase tracking-[0.2em] transition-colors">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          
          <div className="px-8 py-6 border-t border-gray-50 flex items-center justify-between bg-gray-50/30">
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.3em]">Folio {page} of {totalPages}</p>
            <div className="flex gap-5">
              <button
                disabled={!prevPage}
                onClick={() => setPage(prevPage)}
                className="text-[10px] font-bold uppercase tracking-[0.3em] disabled:opacity-20 hover:text-[#AF8F42] transition-all"
              >
                Prev
              </button>
              <button
                disabled={!nextPage}
                onClick={() => setPage(nextPage)}
                className="text-[10px] font-bold uppercase tracking-[0.3em] disabled:opacity-20 hover:text-[#AF8F42] transition-all"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      
      {(showAddModal || (showEditModal && editProduct)) && (
        <div className="fixed inset-0 bg-gray-900/10 backdrop-blur-md flex justify-center items-center z-[100] p-4">
          <div className="bg-white rounded-[2.5rem] shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300 border border-gray-100">
            <div className="p-10 border-b border-gray-50">
              <p className="text-[#AF8F42] text-[10px] tracking-[0.5em] uppercase mb-1">Inventory Management</p>
              <h2 className="text-2xl font-serif text-gray-900">
                {showAddModal ? "New Asset Entry" : "Edit Item Record"}
              </h2>
            </div>

            <div className="p-10 space-y-6">
              {[
                { label: "Product Name", key: "name", type: "text" },
                { label: "Collection / Category", key: "category", type: "text" },
                { label: "Valuation (INR)", key: "price", type: "number" },
                { label: "Stock Units", key: "stock", type: "number" },
                { label: "Image Reference URL", key: "image", type: "text" }
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-[8px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-2 ml-1">{field.label}</label>
                  <input
                    type={field.type}
                    value={showAddModal ? newProduct[field.key] : editProduct?.[field.key]}
                    onChange={(e) => {
                      const val = field.type === "number" ? Number(e.target.value) : e.target.value;
                      showAddModal 
                        ? setNewProduct({ ...newProduct, [field.key]: val })
                        : setEditProduct({ ...editProduct, [field.key]: val });
                    }}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-[12px] text-gray-800 focus:border-[#AF8F42] outline-none transition-all"
                  />
                </div>
              ))}
            </div>

            <div className="p-10 bg-gray-50 flex flex-col gap-4">
              <button
                onClick={showAddModal ? handleAddProduct : handleSaveEdit}
                className="w-full bg-[#AF8F42] text-white py-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#967a38] transition-all shadow-lg shadow-[#AF8F42]/20"
              >
                {showAddModal ? "Confirm Ledger Entry" : "Save Item Updates"}
              </button>
              <button
                onClick={() => { setShowAddModal(false); setShowEditModal(false); }}
                className="text-[9px] font-bold text-gray-400 hover:text-gray-900 uppercase tracking-[0.3em] transition-all"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}