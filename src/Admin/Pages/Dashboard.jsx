import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../../Context/ShopContext";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

export default function Dashboard() {
  const { products, orders } = useContext(ShopContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  
  const COLORS = {
    primary: "#D97706", 
    primaryDark: "#B45309", 
    primaryLight: "#F59E0B", 
    background: "#FFFBEB", 
    card: "#FFFFFF",
    text: "#1F2937",
    textLight: "#6B7280",
    success: "#10B981",
    danger: "#EF4444",
    grid: "#E5E7EB"
  };

  
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

  
  const inStock = products.filter((p) => (p.stock ?? 0) > 0).length;
  const outOfStock = products.filter((p) => (p.stock ?? 0) === 0).length;
  const stockData = [
    { name: "In Stock", value: inStock },
    { name: "Out of Stock", value: outOfStock },
  ];

  
  const categories = Array.from(new Set(products.map((p) => p.category)));

  const categoryOrderCount = {};
  categories.forEach((cat) => (categoryOrderCount[cat] = 0));

  orders.forEach((order) => {
    if (!order.items || order.status.toLowerCase() === "cancelled") return;

    order.items.forEach((item) => {
      if (!item.category) return;
      const category = item.category;
      if (categories.includes(category)) {
        categoryOrderCount[category] += item.quantity ?? 1;
      }
    });
  });

  const radarData = Object.entries(categoryOrderCount).map(([name, orders]) => ({
    name,
    orders,
  }));

  
  const stockPerCategory = categories.map((category) => {
    const totalStock = products
      .filter((p) => p.category === category)
      .reduce((sum, p) => sum + (p.stock ?? 0), 0);
    return { category, stock: totalStock };
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: COLORS.background }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: COLORS.primary }}></div>
          <p className="text-lg font-medium" style={{ color: COLORS.text }}>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full px-4 sm:px-6 md:px-8 lg:px-12 py-8" style={{ backgroundColor: COLORS.background }}>
      
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: COLORS.text }}>
          Admin Dashboard
        </h1>
        <p className="text-lg" style={{ color: COLORS.textLight }}>
          Overview of your store performance
        </p>
      </div>

     
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <div 
          className="relative overflow-hidden rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          style={{ backgroundColor: COLORS.card }}
        >
          <div className="absolute top-0 right-0 w-20 h-20 -mr-6 -mt-6 rounded-full opacity-10" style={{ backgroundColor: COLORS.primary }}></div>
          <div className="flex items-center">
            <div className="p-3 rounded-xl mr-4" style={{ backgroundColor: COLORS.background }}>
              <svg className="w-6 h-6" style={{ color: COLORS.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8V4a1 1 0 00-1-1h-2a1 1 0 00-1 1v1M9 7h6" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide" style={{ color: COLORS.textLight }}>Total Products</h3>
              <p className="text-3xl font-bold mt-1" style={{ color: COLORS.text }}>{products.length}</p>
            </div>
          </div>
        </div>

        <div 
          className="relative overflow-hidden rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          style={{ backgroundColor: COLORS.card }}
        >
          <div className="absolute top-0 right-0 w-20 h-20 -mr-6 -mt-6 rounded-full opacity-10" style={{ backgroundColor: COLORS.primary }}></div>
          <div className="flex items-center">
            <div className="p-3 rounded-xl mr-4" style={{ backgroundColor: COLORS.background }}>
              <svg className="w-6 h-6" style={{ color: COLORS.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide" style={{ color: COLORS.textLight }}>Total Orders</h3>
              <p className="text-3xl font-bold mt-1" style={{ color: COLORS.text }}>{orders.length}</p>
            </div>
          </div>
        </div>

        <div 
          className="relative overflow-hidden rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          style={{ backgroundColor: COLORS.card }}
        >
          <div className="absolute top-0 right-0 w-20 h-20 -mr-6 -mt-6 rounded-full opacity-10" style={{ backgroundColor: COLORS.primary }}></div>
          <div className="flex items-center">
            <div className="p-3 rounded-xl mr-4" style={{ backgroundColor: COLORS.background }}>
              <svg className="w-6 h-6" style={{ color: COLORS.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide" style={{ color: COLORS.textLight }}>Total Users</h3>
              <p className="text-3xl font-bold mt-1" style={{ color: COLORS.text }}>{users.length}</p>
            </div>
          </div>
        </div>
      </div>

      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
        
        <div 
          className="xl:col-span-1 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
          style={{ backgroundColor: COLORS.card }}
        >
          <div className="flex items-center mb-6">
            <div className="p-2 rounded-lg mr-3" style={{ backgroundColor: COLORS.background }}>
              <svg className="w-5 h-5" style={{ color: COLORS.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold" style={{ color: COLORS.text }}>Stock Status</h2>
          </div>
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <defs>
                  <linearGradient id="inStockGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={COLORS.primary} stopOpacity={0.9} />
                    <stop offset="100%" stopColor={COLORS.primaryDark} stopOpacity={0.9} />
                  </linearGradient>
                  <linearGradient id="outStockGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={COLORS.danger} stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#B91C1C" stopOpacity={0.9} />
                  </linearGradient>
                </defs>

                <Pie
                  data={stockData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius="40%"
                  outerRadius="70%"
                  paddingAngle={2}
                  cornerRadius={8}
                  labelLine={false}
                >
                  {stockData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.name === "In Stock" ? "url(#inStockGradient)" : "url(#outStockGradient)"}
                      stroke={COLORS.card}
                      strokeWidth={3}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: COLORS.card, 
                    border: `1px solid ${COLORS.grid}`,
                    borderRadius: '8px',
                    color: COLORS.text
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => <span className="text-sm font-medium" style={{ color: COLORS.text }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

       
        <div 
          className="xl:col-span-2 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
          style={{ backgroundColor: COLORS.card }}
        >
          <div className="flex items-center mb-6">
            <div className="p-2 rounded-lg mr-3" style={{ backgroundColor: COLORS.background }}>
              <svg className="w-5 h-5" style={{ color: COLORS.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold" style={{ color: COLORS.text }}>Stock per Category</h2>
          </div>
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={stockPerCategory} 
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <XAxis 
                  dataKey="category" 
                  tick={{ fill: COLORS.text, fontSize: 12 }}
                  axisLine={{ stroke: COLORS.grid }}
                />
                <YAxis 
                  tick={{ fill: COLORS.textLight, fontSize: 12 }}
                  axisLine={{ stroke: COLORS.grid }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: COLORS.card, 
                    border: `1px solid ${COLORS.grid}`,
                    borderRadius: '8px',
                    color: COLORS.text
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="stock" 
                  fill={COLORS.primary}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

    
      <div 
        className="rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
        style={{ backgroundColor: COLORS.card }}
      >
        <div className="flex items-center mb-6">
          <div className="p-2 rounded-lg mr-3" style={{ backgroundColor: COLORS.background }}>
            <svg className="w-5 h-5" style={{ color: COLORS.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
          <h2 className="text-xl font-bold" style={{ color: COLORS.text }}>Orders per Category</h2>
        </div>
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke={COLORS.grid} />
              <PolarAngleAxis 
                dataKey="name" 
                tick={{ fill: COLORS.text, fontSize: 12 }}
              />
              <PolarRadiusAxis 
                tick={{ fill: COLORS.textLight, fontSize: 10 }}
              />
              <Radar
                name="Orders"
                dataKey="orders"
                stroke={COLORS.primary}
                fill={COLORS.primaryLight}
                fillOpacity={0.6}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: COLORS.card, 
                  border: `1px solid ${COLORS.grid}`,
                  borderRadius: '8px',
                  color: COLORS.text
                }}
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}