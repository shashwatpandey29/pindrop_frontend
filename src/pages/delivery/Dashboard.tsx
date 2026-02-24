import { useEffect, useState } from "react";
import API from "@/api/api";

interface OrderItem {
  id: number;
  dish_name: string;
  quantity: number;
}

interface Order {
  id: number;
  restaurant_name: string;
  customer_name: string;
  total_amount: number;
  order_status: string;
  items: OrderItem[];
}

interface DeliveryStatus {
  availability: boolean;
  pin_code: string;
}

export default function DeliveryDashboard() {
  const [status, setStatus] = useState<DeliveryStatus | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const fetchData = async () => {
    try {
      const [statusRes, ordersRes] = await Promise.all([
        API.delivery.getStatus(),
        API.delivery.getAssignedOrders()
      ]);
      setStatus(statusRes.data);
      setOrders(ordersRes.data);
    } catch (err) {
      console.error("Failed to fetch delivery data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleAvailability = async () => {
    try {
      const res = await API.delivery.toggleAvailability();
      setStatus((prev) => prev ? { ...prev, availability: res.data.availability } : null);
    } catch (err) {
      alert("Failed to toggle status.");
    }
  };

  const handleMarkDelivered = async (orderId: number) => {
    setActionLoading(orderId);
    try {
      await API.delivery.markDelivered(orderId);
      // Update local state to reflect the delivered status
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, order_status: "Delivered" } : o))
      );
      // The backend automatically sets the driver back to 'available' when an order is delivered,
      // so we should update our local status state too.
      setStatus((prev) => prev ? { ...prev, availability: true } : null);
    } catch (err: any) {
      alert(err.response?.data?.detail || "Failed to mark as delivered.");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 animate-pulse">
        <p className="text-lg font-medium">Loading your delivery profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header & Status Toggle */}
      <div className="bg-white rounded-xl shadow-sm border p-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Driver Hub</h1>
          <p className="text-gray-500 mt-1">
            Operating in Pin Code: <strong className="text-gray-800">{status?.pin_code}</strong>
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <span className={`font-bold ${status?.availability ? "text-green-600" : "text-gray-500"}`}>
            {status?.availability ? "🟢 ONLINE" : "⚫ OFFLINE"}
          </span>
          <button
            onClick={handleToggleAvailability}
            className={`px-6 py-2.5 rounded-lg font-bold transition-colors ${
              status?.availability 
                ? "bg-red-100 text-red-700 hover:bg-red-200" 
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            {status?.availability ? "Go Offline" : "Go Online"}
          </button>
        </div>
      </div>

      {/* Active Deliveries */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Assigned Deliveries</h2>
        
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 bg-white rounded-xl shadow-sm border border-dashed border-gray-300 p-8 text-center">
            <p className="text-lg font-medium text-gray-600 mb-2">No active assignments</p>
            <p className="text-sm text-gray-400">Make sure you are online to receive orders from restaurants.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow-sm border p-5 flex flex-col md:flex-row justify-between items-center gap-4">
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-bold text-gray-800">Order #{order.id}</h3>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                      order.order_status === "Delivered" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800 animate-pulse"
                    }`}>
                      {order.order_status}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    <strong>Pickup:</strong> {order.restaurant_name}
                  </p>
                  <p className="text-gray-600 text-sm">
                    <strong>Dropoff:</strong> {order.customer_name}
                  </p>
                  
                  <div className="mt-3 flex flex-wrap gap-2">
                    {order.items.map((item) => (
                      <span key={item.id} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                        {item.quantity}x {item.dish_name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3 w-full md:w-auto">
                  <p className="text-2xl font-bold text-gray-900">₹{order.total_amount.toFixed(2)}</p>
                  
                  {order.order_status === "Out for Delivery" && (
                    <button
                      onClick={() => handleMarkDelivered(order.id)}
                      disabled={actionLoading === order.id}
                      className="w-full md:w-auto bg-blue-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {actionLoading === order.id ? "Updating..." : "Mark as Delivered ✓"}
                    </button>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}