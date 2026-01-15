import React, { useState, useEffect } from "react";
import api from "../../api/axios";

export default function AdminOrders() {
  const [overview, setOverview] = useState({
    total: 0,
    processing: 0,
    delivered: 0,
    cancelled: 0,
  });

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price / 100);

  /* ---------------- Logic Intact ---------------- */
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const fetchOverview = async () => {
    try {
      const res = await api.get("admin/orders/overview/");
      setOverview(res.data);
    } catch (err) {
      console.error("Overview fetch failed", err);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (initialLoading) setLoading(true);
        const params = {};
        if (debouncedSearch) params.search = debouncedSearch;
        if (statusFilter) params.status = statusFilter;
        params.page = page;
        const res = await api.get("admin/orders/", { params });
        setOrders(res.data.results || []);
        setTotalPages(res.data.total_pages || 1);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setOrders([]);
      } finally {
        setLoading(false);
        setInitialLoading(false); 
      }
    };
    fetchOrders();
  }, [debouncedSearch, statusFilter, page]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await api.patch(`admin/orders/${orderId}/status/`, {
        status: newStatus,
      });
      setOrders((prev) => prev.map((o) => (o.id === orderId ? res.data : o)));
      setSelectedOrder(res.data);
      fetchOverview();
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border border-gray-100 border-t-[#AF8F42]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-gray-800 p-8">
      <div className="max-w-7xl mx-auto">
        
        
        <header className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-[10px] tracking-[0.4em] uppercase text-[#AF8F42] mb-2 font-bold">Transaction Ledger</p>
              <h1 className="text-4xl font-serif text-gray-900 tracking-tight">Orders</h1>
            </div>
            
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="SEARCH REFERENCE..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-gray-50 border border-gray-200 px-5 py-3 rounded-xl text-[10px] tracking-[0.2em] uppercase text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#AF8F42]/30 transition-all w-64"
              />
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                className="bg-white border border-gray-200 px-4 py-3 rounded-xl text-[10px] tracking-[0.2em] uppercase text-gray-500 focus:outline-none cursor-pointer"
              >
                <option value="">ALL STATUS</option>
                <option value="pending">PENDING</option>
                <option value="confirmed">CONFIRMED</option>
                <option value="delivered">DELIVERED</option>
                <option value="cancelled">CANCELLED</option>
              </select>
            </div>
          </div>
          <div className="h-px w-full bg-gray-100 mt-8" />
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Gross Revenue", value: overview.total, color: "text-gray-900" },
            { label: "In Fulfillment", value: overview.processing, color: "text-[#AF8F42]" },
            { label: "Completed", value: overview.delivered, color: "text-emerald-600" },
            { label: "Voided", value: overview.cancelled, color: "text-rose-400" }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-3">{stat.label}</p>
              <p className={`text-2xl font-serif ${stat.color}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        
        <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">Order Reference</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">Client</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">Date</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">Value</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">Status</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order) => (
                  <tr key={order.id} className="group hover:bg-gray-50/50 transition-all cursor-pointer">
                    <td className="px-8 py-6 font-mono text-[10px] text-gray-400 uppercase tracking-widest">
                      #{order.id.toString().slice(-6)}
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-[12px] font-bold text-gray-800 tracking-wider uppercase">{order.customerDetails.name}</p>
                      <p className="text-[9px] text-gray-400 tracking-widest lowercase mt-0.5">{order.customerDetails.email}</p>
                    </td>
                    <td className="px-8 py-6 text-[11px] text-gray-500 uppercase tracking-tighter">
                      {new Date(order.created_at).toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-[12px] font-bold text-gray-900 tracking-wider">{formatPrice(order.amount)}</p>
                      <p className={`text-[8px] font-bold uppercase tracking-[0.2em] ${order.is_paid ? "text-emerald-500" : "text-amber-500"}`}>
                        {order.is_paid ? "Verified" : "Unpaid"}
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`text-[9px] font-bold tracking-[0.2em] uppercase px-3 py-1 rounded-full border ${
                        order.status === 'delivered' ? 'border-emerald-100 text-emerald-600' : 
                        order.status === 'cancelled' ? 'border-rose-100 text-rose-400' : 
                        'border-[#AF8F42]/20 text-[#AF8F42]'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-[#AF8F42] transition-colors"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          
          <div className="px-8 py-6 border-t border-gray-50 flex items-center justify-between bg-gray-50/30">
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.3em]">Folio {page} of {totalPages}</p>
            <div className="flex gap-4">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="text-[10px] font-bold uppercase tracking-[0.3em] disabled:opacity-20 hover:text-[#AF8F42] transition-all"
              >
                Previous
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="text-[10px] font-bold uppercase tracking-[0.3em] disabled:opacity-20 hover:text-[#AF8F42] transition-all"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      
      {selectedOrder && (
        <div className="fixed inset-0 bg-gray-900/10 backdrop-blur-md flex items-center justify-center z-[100] p-6">
          <div className="bg-white border border-gray-200 rounded-[2.5rem] w-full max-w-xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-12">
              <div className="flex justify-between items-start mb-10">
                <div>
                  <p className="text-[#AF8F42] text-[10px] tracking-[0.5em] uppercase mb-1">Invoice Archive</p>
                  <h2 className="text-3xl font-serif text-gray-900">Reference #{selectedOrder.id.toString().slice(-8)}</h2>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="text-gray-300 hover:text-gray-900 transition-colors">✕</button>
              </div>

              <div className="grid grid-cols-2 gap-12 mb-10">
                <div>
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Customer Profile</label>
                  <p className="text-xs font-bold text-gray-800 uppercase tracking-widest mb-1">{selectedOrder.customerDetails.name}</p>
                  <p className="text-[10px] text-gray-500 lowercase tracking-wider">{selectedOrder.customerDetails.email}</p>
                </div>
                <div>
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Payment Class</label>
                  <p className="text-xs font-bold text-gray-800 uppercase tracking-widest mb-1">{selectedOrder.payment_method}</p>
                  <p className={`text-[9px] font-bold uppercase tracking-widest ${selectedOrder.is_paid ? 'text-emerald-500' : 'text-amber-500'}`}>
                    {selectedOrder.is_paid ? "Settled" : "Awaiting Funds"}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6 mb-10 border border-gray-100">
                <label className="text-[8px] font-bold text-gray-400 uppercase tracking-widest block mb-4">Line Items</label>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-[11px] uppercase tracking-wider">
                      <span className="text-gray-600">{item.name} <span className="text-gray-400 lowercase italic ml-2">x{item.quantity}</span></span>
                      <span className="font-bold text-gray-900">{formatPrice(item.price)}</span>
                    </div>
                  ))}
                  <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                    <span className="text-[10px] font-bold text-gray-900 uppercase tracking-[0.2em]">Total Amount</span>
                    <span className="text-lg font-serif text-[#AF8F42]">{formatPrice(selectedOrder.amount)}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <div>
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-3 text-center">Update Logistics Status</label>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                    className="w-full bg-white border border-gray-200 px-4 py-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.3em] text-gray-700 outline-none focus:border-[#AF8F42] transition-all"
                  >
                    <option value="pending">PENDING REVIEW</option>
                    <option value="confirmed">CONFIRMED</option>
                    <option value="delivered">MARK AS DELIVERED</option>
                    <option value="cancelled">VOID TRANSACTION</option>
                  </select>
                </div>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.3em] hover:text-gray-900 transition-colors"
                >
                  Close Archive
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}