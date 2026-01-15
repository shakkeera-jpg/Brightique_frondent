import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function User() {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [overview, setOverview] = useState({
    total: 0,
    admins: 0,
    users: 0,
    blocked: 0,
  });
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [notifyTitle, setNotifyTitle] = useState("");
  const [notifyMessage, setNotifyMessage] = useState("");
  const [sending, setSending] = useState(false);

  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const res = await api.get(
        `users/?search=${search}&role=${role}&page=${page}`
      );

      setUsers(res.data.results);
      setTotalPages(res.data.total_pages);
      setTotalCount(res.data.count);
      setOverview(res.data.overview);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchUsers();
  }, [search, role, page]);

  const openUserModal = async (id) => {
    try {
      setDetailLoading(true);
      const res = await api.get(`users/${id}/`);
      setSelectedUser(res.data);
      setShowModal(true);
    } catch (err) {
      console.error("Failed to fetch user details");
    } finally {
      setDetailLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const isBlocked = newStatus === "Blocked";
      await api.patch(`users/${id}/`, { is_blocked: isBlocked });
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, is_blocked: isBlocked } : u))
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const sendNotification = async () => {
    if (!notifyTitle || !notifyMessage) return;

    try {
      setSending(true);

      await api.post("send-notification/", {
        user_id: selectedUser.id,
        title: notifyTitle,
        message: notifyMessage,
      });

      setNotifyOpen(false);
      setNotifyTitle("");
      setNotifyMessage("");
    } catch (err) {
      console.error("Failed to send notification");
    } finally {
      setSending(false);
    }
  };


  const totalUsers = overview.total;
  const adminCount = overview.admins;
  const normalUserCount = overview.users;
  const blockedCount = overview.blocked;
  const activeCount = totalUsers - blockedCount;


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-100 border-t-[#AF8F42]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-gray-800 p-8">
      <div className="max-w-7xl mx-auto">


        <header className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-[10px] tracking-[0.4em] uppercase text-[#AF8F42] mb-2 font-bold">Administration</p>
              <h1 className="text-4xl font-serif text-gray-900 tracking-tight">Members</h1>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="SEARCH DIRECTORY..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-gray-50 border border-gray-200 px-5 py-3 rounded-xl text-[10px] tracking-[0.2em] uppercase text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#AF8F42]/30 transition-all w-64"
              />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="bg-white border border-gray-200 px-4 py-3 rounded-xl text-[10px] tracking-[0.2em] uppercase text-gray-500 focus:outline-none cursor-pointer"
              >
                <option value="all">ALL ROLES</option>
                <option value="user">USER</option>
                <option value="admin">ADMIN</option>
              </select>
            </div>
          </div>
          <div className="h-px w-full bg-gray-100 mt-8" />
        </header>

        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          {[
            { label: "Accounts", val: totalUsers },
            { label: "Executives", val: adminCount },
            { label: "Standard", val: normalUserCount },
            { label: "Verified", val: activeCount, color: "text-[#AF8F42]" },
            { label: "Restricted", val: blockedCount, color: "text-red-400" },
          ].map((item, i) => (
            <div key={i} className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
              <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-3">{item.label}</p>
              <div className={`text-3xl font-serif ${item.color || "text-gray-900"}`}>{item.val}</div>
            </div>
          ))}
        </div>

        
        <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">Identity</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">Email</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">Status</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] text-right">Access</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    onClick={() => openUserModal(user.id)}
                    className="group hover:bg-gray-50/50 transition-all cursor-pointer"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center bg-gray-50 text-gray-400 font-serif group-hover:border-[#AF8F42]/50 group-hover:text-[#AF8F42] transition-all">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-[12px] font-bold text-gray-800 tracking-wider uppercase">{user.name}</div>
                          <div className="text-[9px] text-gray-400 tracking-widest uppercase mt-0.5">ID: {user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-xs text-gray-500 tracking-wide">{user.email}</div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`text-[9px] font-bold tracking-[0.2em] uppercase px-2 py-0.5 rounded border ${user.role === 'admin' ? 'border-[#AF8F42]/20 text-[#AF8F42]' : 'border-gray-100 text-gray-400'
                        }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={user.is_blocked ? "Blocked" : "Active"}
                        onChange={(e) => handleStatusChange(user.id, e.target.value)}
                        className={`bg-transparent text-[10px] font-bold uppercase tracking-[0.2em] outline-none cursor-pointer ${user.is_blocked ? "text-red-400" : "text-[#AF8F42]"
                          }`}
                      >
                        <option value="Active">● Active</option>
                        <option value="Blocked">● Blocked</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      
      {showModal && (
        <div className="fixed inset-0 bg-gray-900/10 backdrop-blur-md flex items-center justify-center z-[100] p-6">
          <div className="bg-white border border-gray-200 rounded-[2.5rem] w-full max-w-md shadow-xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-12 text-center">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-8 right-8 text-gray-300 hover:text-gray-500 transition-colors"
              >✕</button>

              <div className="w-20 h-20 mx-auto mb-6 rounded-full border border-gray-100 flex items-center justify-center text-2xl font-serif text-[#AF8F42] bg-gray-50">
                {selectedUser?.name.charAt(0)}
              </div>

              {detailLoading ? (
                <div className="py-8 animate-pulse text-[10px] tracking-widest text-gray-400 uppercase">Loading Data...</div>
              ) : selectedUser && (
                <>
                  <p className="text-[#AF8F42] text-[10px] tracking-[0.4em] uppercase mb-1">Account Dossier</p>
                  <h3 className="text-2xl font-serif text-gray-900 mb-1">{selectedUser.name}</h3>
                  <p className="text-gray-400 text-[10px] tracking-widest mb-8 uppercase">{selectedUser.email}</p>

                  <div className="grid grid-cols-2 gap-4 mb-10">
                    <div className="bg-gray-50 p-4 rounded-2xl">
                      <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1">Access</p>
                      <p className="text-[10px] font-bold text-gray-800 uppercase tracking-widest">{selectedUser.role}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-2xl">
                      <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
                      <p className={`text-[10px] font-bold uppercase tracking-widest ${selectedUser.is_blocked ? 'text-red-400' : 'text-[#AF8F42]'}`}>
                        {selectedUser.is_blocked ? 'Restricted' : 'Verified'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      handleStatusChange(selectedUser.id, selectedUser.is_blocked ? "Active" : "Blocked");
                      setShowModal(false);
                    }}
                    className={`w-full py-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.3em] transition-all ${selectedUser.is_blocked
                      ? "bg-[#AF8F42] text-white hover:bg-[#967a38] shadow-lg shadow-[#AF8F42]/20"
                      : "bg-white text-gray-400 border border-gray-200 hover:bg-gray-50"
                      }`}
                  >
                    {selectedUser.is_blocked ? "Restore Access" : "Restrict Member"}
                  </button>

                  <button
                    onClick={() => setNotifyOpen(true)}
                    className="w-full py-4 mt-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.3em]
                    bg-gray-900 text-white hover:bg-gray-800 transition-all"
                  >
                    Send Notification
                  </button>
                </>
              )}

            </div>
          </div>
        </div>
      )}

      {notifyOpen && (
        <div className="fixed inset-0 bg-[#0a0a0a]/30 backdrop-blur-md flex items-center justify-center z-[200] p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden">

            
            <div className="p-10 pb-6 text-center border-b border-gray-50">
              <p className="text-[10px] tracking-[0.5em] uppercase text-[#AF8F42] mb-3 font-bold">Communication</p>
              <h3 className="text-2xl font-serif text-gray-900">Broadcast Update</h3>
              <div className="h-px w-8 bg-gray-100 mx-auto mt-4" />
            </div>

            
            <div className="p-10 space-y-6">
              <div>
                <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-2 ml-1">
                  Notification Title
                </label>
                <input
                  value={notifyTitle}
                  onChange={(e) => setNotifyTitle(e.target.value)}
                  placeholder="E.G. NEW COLLECTION LIVE"
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-[12px] text-gray-800 placeholder-gray-300 focus:border-[#AF8F42] focus:bg-white outline-none transition-all tracking-wider"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-2 ml-1">
                  Dispatch Message
                </label>
                <textarea
                  value={notifyMessage}
                  onChange={(e) => setNotifyMessage(e.target.value)}
                  placeholder="DESCRIBE THE UPDATE FOR YOUR CLIENTS..."
                  rows={4}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-[12px] text-gray-800 placeholder-gray-300 focus:border-[#AF8F42] focus:bg-white outline-none transition-all tracking-wider resize-none"
                />
              </div>
            </div>

            
            <div className="p-10 pt-2 bg-gray-50/50 flex flex-col gap-3">
              <button
                onClick={sendNotification}
                disabled={sending}
                className="w-full bg-[#AF8F42] text-white py-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#967a38] transition-all shadow-lg shadow-[#AF8F42]/20 disabled:opacity-50 active:scale-[0.98]"
              >
                {sending ? "TRANSMITTING..." : "CONFIRM DISPATCH"}
              </button>

              <button
                onClick={() => setNotifyOpen(false)}
                className="w-full py-2 text-[9px] font-bold text-gray-400 hover:text-gray-600 uppercase tracking-[0.3em] transition-colors"
              >
                Discard Draft
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mt-8 text-[10px] uppercase tracking-widest">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 border rounded-xl disabled:opacity-40"
        >
          Previous
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 border rounded-xl disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}