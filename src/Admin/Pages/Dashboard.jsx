import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, AreaChart, Area,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  const COLORS = {
    gold: "#AF8F42",
    goldLight: "#E5D5B0",
    slate: "#1f2937",
    grayLight: "#9ca3af",
    bg: "#f9fafb",
    white: "#ffffff",
    border: "#f3f4f6"
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("dashboard/");
        setDashboard(res.data);
      } catch (error) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.clear();
          window.location.href = "/login";
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#fcfcfc]">
        <div className="w-8 h-8 border-2 border-t-[#AF8F42] border-gray-200 rounded-full animate-spin" />
      </div>
    );
  }

  if (!dashboard) return null;

  const stats = [
    { label: "Gross Revenue", value: `${dashboard.total_revenue.toLocaleString()}`, trend: "Global Portfolio", icon: "Balance" },
    { label: "Boutique Assets", value: dashboard.total_products, trend: "Inventory Count", icon: "Store" },
    { label: "Order Volume", value: dashboard.total_orders, trend: "Client Requests", icon: "List" },
    { label: "Member Base", value: dashboard.total_users, trend: "Total Registrations", icon: "Users" },
  ];

  return (
    <div className="min-h-screen w-full pb-20" style={{ backgroundColor: COLORS.bg }}>
      
      {/* 1. HEADER */}
      <div className="bg-white border-b border-gray-100 px-8 py-8 mb-8">
        <div className="max-w-7xl mx-auto flex justify-between items-end">
          <div>
            <p className="text-[9px] tracking-[0.4em] text-[#AF8F42] uppercase font-bold mb-1">Brightique Analytics</p>
            <h1 className="text-4xl font-light text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
              The Dashboard
            </h1>
          </div>
          <div className="hidden md:block text-right">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Reporting Status</p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-xs font-medium text-gray-600 uppercase tracking-tighter">Live Intelligence</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 space-y-8">
        
        {/* 2. OVERVIEW CARDS (TOP) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((item, index) => (
            <div key={index} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm transition-transform hover:-translate-y-1">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">{item.label}</p>
              <p className="text-2xl font-bold text-gray-900 mb-2">{`₹${item.value}`}</p>
              <div className="h-[1px] w-8 bg-[#AF8F42] mb-2"></div>
              <p className="text-[9px] text-gray-400 italic tracking-wider">{item.trend}</p>
            </div>
          ))}
        </div>

        {/* 3. REVENUE TREND CHART (FULL WIDTH) */}
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 tracking-tight">Financial Trajectory</h2>
              <p className="text-xs text-gray-400">Monthly revenue accumulation and market growth</p>
            </div>
            <div className="bg-[#fcfcfc] border border-gray-100 px-4 py-2 rounded-full">
               <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">30 Day Report</span>
            </div>
          </div>
          <div className="h-[400px]">
            <ResponsiveContainer>
              <AreaChart data={dashboard.revenue_over_time}>
                <defs>
                  <linearGradient id="revenueGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#AF8F42" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#AF8F42" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 10}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 10}} tickFormatter={(v) => `$${v}`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#AF8F42" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#revenueGlow)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. SECONDARY ANALYTICS (PIE, BAR, RADAR) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Stock Composition */}
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-6">Inventory Health</h3>
            <div className="h-64">
              <ResponsiveContainer>
                <PieChart>
                  <Pie 
                    data={[
                      { name: "Available", value: dashboard.in_stock },
                      { name: "Depleted", value: dashboard.out_of_stock }
                    ]} 
                    dataKey="value" 
                    innerRadius={70} 
                    outerRadius={90} 
                    paddingAngle={8}
                  >
                    <Cell fill="#AF8F42" stroke="none" />
                    <Cell fill="#1a1a1a" stroke="none" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-[#AF8F42]"></div>
                 <span className="text-[10px] uppercase tracking-tighter text-gray-500">In Stock</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-[#1a1a1a]"></div>
                 <span className="text-[10px] uppercase tracking-tighter text-gray-500">Out of Stock</span>
               </div>
            </div>
          </div>

          {/* Category Performance */}
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm lg:col-span-2">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-6">Revenue by Category</h3>
            <div className="h-72">
              <ResponsiveContainer>
                <BarChart data={dashboard.revenue_per_category} margin={{left: -20}}>
                  <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 10}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 10}} />
                  <Tooltip cursor={{fill: '#fcfcfc'}} />
                  <Bar dataKey="revenue" fill="#AF8F42" radius={[4, 4, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Market Demand (Radar) */}
          <div className="bg-[#1a1a1a] p-8 rounded-2xl shadow-xl lg:col-span-3 h-[400px]">
             <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#AF8F42] mb-6">Strategic Demand Analysis</h3>
             <div className="h-[300px]">
                <ResponsiveContainer>
                  <RadarChart data={dashboard.orders_per_category.map(i => ({name: i.category, orders: i.orders}))}>
                    <PolarGrid stroke="#374151" />
                    <PolarAngleAxis dataKey="name" tick={{fill: '#9ca3af', fontSize: 10}} />
                    <Radar 
                      name="Volume" 
                      dataKey="orders" 
                      stroke="#AF8F42" 
                      fill="#AF8F42" 
                      fillOpacity={0.4} 
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}