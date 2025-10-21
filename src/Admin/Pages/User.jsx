import React, { useEffect, useState } from "react";
import axios from "axios";

export default function User() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("https://brightique.onrender.com/users");
        setUsers(res.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  
  const handleRoleChange = async (id, newRole) => {
    try {
      await axios.patch(`https://brightique.onrender.com/users/${id}`, { role: newRole });
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, role: newRole } : u))
      );
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  
  const handleStatusChange = async (id, newStatus) => {
    try {
      const isBlocked = newStatus === "Blocked";
      await axios.patch(`https://brightique.onrender.com/users/${id}`, { isBlocked });
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, isBlocked } : u))
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  
  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role === "admin").length;
  const normalUserCount = users.filter((u) => u.role === "user").length;
  const blockedCount = users.filter((u) => u.isBlocked).length;
  const activeCount = totalUsers - blockedCount;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-amber-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-gray-800">
            Loading users...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-amber-50">
      
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold mb-2 text-gray-900">
          User Management
        </h1>
        <p className="text-sm text-gray-600">Manage user roles and status</p>
      </div>

      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-5xl mx-auto mb-8">
        <div className="bg-white border border-amber-200 rounded-xl p-4 text-center shadow-sm">
          <p className="text-gray-500 text-sm">Total Users</p>
          <p className="text-2xl font-bold text-amber-600">{totalUsers}</p>
        </div>
        <div className="bg-white border border-blue-200 rounded-xl p-4 text-center shadow-sm">
          <p className="text-gray-500 text-sm">Admins</p>
          <p className="text-2xl font-bold text-blue-600">{adminCount}</p>
        </div>
        <div className="bg-white border border-green-200 rounded-xl p-4 text-center shadow-sm">
          <p className="text-gray-500 text-sm">Users</p>
          <p className="text-2xl font-bold text-green-600">{normalUserCount}</p>
        </div>
        <div className="bg-white border border-emerald-200 rounded-xl p-4 text-center shadow-sm">
          <p className="text-gray-500 text-sm">Active</p>
          <p className="text-2xl font-bold text-emerald-600">{activeCount}</p>
        </div>
        <div className="bg-white border border-red-200 rounded-xl p-4 text-center shadow-sm">
          <p className="text-gray-500 text-sm">Blocked</p>
          <p className="text-2xl font-bold text-red-600">{blockedCount}</p>
        </div>
      </div>

      
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-amber-100">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-amber-500 text-white">
                <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-amber-50 hover:bg-amber-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{user.email}</td>
                  <td className="px-6 py-4">
                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(user.id, e.target.value)
                      }
                      className="border border-amber-300 rounded-lg px-3 py-2 text-sm bg-white text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={user.isBlocked ? "Blocked" : "Active"}
                      onChange={(e) =>
                        handleStatusChange(user.id, e.target.value)
                      }
                      className={`border rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 ${
                        user.isBlocked
                          ? "bg-red-100 text-red-700 border-red-300"
                          : "bg-green-100 text-green-700 border-green-300"
                      }`}
                    >
                      <option value="Active">Active</option>
                      <option value="Blocked">Blocked</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
