import { useEffect, useState } from "react";
import API from "@/api/api";

interface PlatformStats {
  total_orders: number;
  total_revenue: number;
  total_restaurants: number;
  total_customers: number;
  total_delivery_partners: number;
  orders_by_status: Record<string, number>;
}

export default function AdminStats() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    try {
      const res = await API.admin.getStats();
      setStats(res.data);
    } catch (err) {
      setError("Failed to load platform statistics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 animate-pulse">
        <p className="text-lg font-medium">Crunching the platform numbers...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-4 text-red-700 bg-red-100 rounded-md border border-red-200">
        {error || "No data available."}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Platform Overview</h1>
          <p className="text-gray-500 mt-1">Real-time statistics for PinDrop Eats.</p>
        </div>
        <button 
          onClick={fetchStats}
          className="text-blue-600 bg-blue-50 px-4 py-2 rounded hover:bg-blue-100 font-medium transition-colors"
        >
          Refresh Data
        </button>
      </div>

      {/* Top Level Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue Card */}
        <div className="bg-white rounded-xl shadow-sm border p-6 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 text-green-600 rounded-lg">💰</div>
            <h3 className="text-gray-500 font-medium uppercase tracking-wider text-sm">Total Revenue</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">₹{stats.total_revenue.toFixed(2)}</p>
        </div>

        {/* Orders Card */}
        <div className="bg-white rounded-xl shadow-sm border p-6 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">📦</div>
            <h3 className="text-gray-500 font-medium uppercase tracking-wider text-sm">Total Orders</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.total_orders}</p>
        </div>

        {/* Restaurants Card */}
        <div className="bg-white rounded-xl shadow-sm border p-6 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">🏪</div>
            <h3 className="text-gray-500 font-medium uppercase tracking-wider text-sm">Restaurants</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.total_restaurants}</p>
        </div>

        {/* Users Card */}
        <div className="bg-white rounded-xl shadow-sm border p-6 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">👥</div>
            <h3 className="text-gray-500 font-medium uppercase tracking-wider text-sm">Active Users</h3>
          </div>
          <div className="flex items-end gap-2">
            <p className="text-3xl font-bold text-gray-900">{stats.total_customers + stats.total_delivery_partners}</p>
            <span className="text-sm text-gray-500 mb-1">
              ({stats.total_customers} Cust. / {stats.total_delivery_partners} Drivers)
            </span>
          </div>
        </div>
      </div>

      {/* Breakdown Section */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b">
          <h2 className="text-lg font-bold text-gray-800">Orders by Status</h2>
        </div>
        <div className="p-6">
          {Object.keys(stats.orders_by_status).length === 0 ? (
            <p className="text-gray-500 text-center py-4">No order data available yet.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Object.entries(stats.orders_by_status).map(([status, count]) => (
                <div key={status} className="flex justify-between items-center p-4 border rounded-lg bg-gray-50">
                  <span className="font-semibold text-gray-700">{status}</span>
                  <span className="bg-white px-3 py-1 rounded-full border shadow-sm font-bold text-gray-900">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}