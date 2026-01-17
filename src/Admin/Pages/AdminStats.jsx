import React, { useState, useEffect } from "react";
import api from "@/api/axios";

function AdminStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get(
          "/orders/admin/stats/"
        );
        setStats(res.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-600">
        Loading dashboard…
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">
        📈 Admin Analytics Dashboard
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Products Purchased */}
        <StatCard
          title="Products Sold"
          value={stats.total_products_purchased}
          emoji="📦"
        />
        {/* Total Revenue */}
        <StatCard
          title="Total Revenue"
          value={`$ ${stats.total_revenue}`}
          emoji="💰"
        />
        {/* Total Orders */}
        <StatCard
          title="All Orders"
          value={stats.total_orders}
          emoji="🧾"
        />
        {/* Paid Orders */}
        <StatCard
          title="Successful Payments"
          value={stats.paid_orders}
          emoji="✔️"
        />
      </div>

      <footer className="text-center text-gray-500 text-sm pt-8">
        Powered by Django REST + React ⚡
      </footer>
    </div>
  );
}

function StatCard({ title, value, emoji }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
        <span className="text-2xl">{emoji}</span>
      </div>
      <p className="text-3xl font-bold mt-3 text-gray-900">{value}</p>
    </div>
  );
}

export default AdminStats;

