import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Clock, CheckCircle2, Package, MapPin, 
  ChevronRight, RotateCcw, HelpCircle, ArrowLeft,
  Truck
} from "lucide-react";
import API from "@/api/api";

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reorderLoading, setReorderLoading] = useState<number | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.customer.getOrders();
        setOrders(res.data);
      } catch (err: any) {
        setError("Failed to load your orders.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleReorder = async (orderId: number) => {
    setReorderLoading(orderId);
    try {
      const res = await API.customer.reorder(orderId);
      navigate("/customer/cart");
    } catch (err: any) {
      alert(err.response?.data?.detail || "Failed to reorder.");
    } finally {
      setReorderLoading(null);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "Placed": return { color: "text-blue-600 bg-blue-50", icon: Clock, label: "Order Placed" };
      case "Preparing": return { color: "text-orange-600 bg-orange-50", icon: Package, label: "Cooking" };
      case "Out for Delivery": return { color: "text-purple-600 bg-purple-50 animate-bounce", icon: Truck, label: "On the Way" };
      case "Delivered": return { color: "text-green-600 bg-green-50", icon: CheckCircle2, label: "Delivered" };
      case "Cancelled": return { color: "text-red-600 bg-red-50", icon: HelpCircle, label: "Cancelled" };
      default: return { color: "text-gray-600 bg-gray-50", icon: Clock, label: status };
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-96">
      <div className="w-12 h-12 border-4 border-[#FF3041] border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 font-[1000] text-slate-400 uppercase tracking-widest text-xs">Finding your meals...</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto pb-20 px-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <button onClick={() => navigate("/customer")} className="p-3 bg-white border border-slate-100 rounded-2xl shadow-sm hover:bg-slate-50 transition-all">
          <ArrowLeft className="w-5 h-5 text-slate-900" />
        </button>
        <div>
          <h1 className="text-4xl font-[1000] text-slate-900 tracking-tighter leading-none">Your <span className="text-[#FF3041]">Orders</span></h1>
          <p className="text-slate-500 font-bold mt-1">Check current status and past cravings.</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-slate-100">
           <Package className="w-16 h-16 text-slate-200 mx-auto mb-6" />
           <h3 className="text-2xl font-black text-slate-300 uppercase italic">No history yet</h3>
           <button onClick={() => navigate("/customer")} className="mt-6 text-[#FF3041] font-black underline underline-offset-8">Order something tasty now</button>
        </div>
      ) : (
        <div className="space-y-10">
          {orders.map((order) => {
            const statusConfig = getStatusConfig(order.order_status);
            const StatusIcon = statusConfig.icon;
            
            return (
              <div key={order.id} className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden">
                
                {/* Card Top Section */}
                <div className="p-8">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 bg-slate-900 rounded-3xl flex items-center justify-center text-3xl shadow-xl shadow-slate-200 group-hover:rotate-6 transition-transform">
                        🍔
                      </div>
                      <div>
                        <h2 className="text-2xl font-[1000] text-slate-900 tracking-tighter group-hover:text-[#FF3041] transition-colors">{order.restaurant_name}</h2>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">Order #{order.id} • {new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest border ${statusConfig.color}`}>
                       <StatusIcon className="w-4 h-4" />
                       {statusConfig.label}
                    </div>
                  </div>

                  {/* Items List - Horizontal Scroll on Mobile */}
                  <div className="bg-slate-50 rounded-[2rem] p-6 mb-8 flex flex-wrap gap-3">
                     {order.items.map((item: any) => (
                       <div key={item.id} className="bg-white px-4 py-2 rounded-xl border border-slate-100 flex items-center gap-2 shadow-sm">
                          <span className="text-[#FF3041] font-black text-xs">x{item.quantity}</span>
                          <span className="text-xs font-bold text-slate-700">{item.dish_name}</span>
                       </div>
                     ))}
                  </div>

                  {/* Delivery Partner Pulse Section */}
                  {order.delivery_partner_name && order.order_status !== "Delivered" && (
                    <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-2xl border border-orange-100 mb-8 animate-in fade-in zoom-in duration-500">
                       <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                          <Truck className="w-5 h-5 text-orange-500" />
                       </div>
                       <p className="text-xs font-bold text-orange-800">
                         <span className="font-black uppercase tracking-tighter mr-2">Rider assigned:</span>
                         {order.delivery_partner_name} is on their way!
                       </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-8 border-t border-slate-50">
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Paid</p>
                        <p className="text-2xl font-[1000] text-slate-900 tracking-tighter">₹{order.total_amount.toFixed(2)}</p>
                     </div>
                     <div className="flex gap-3">
                        <button 
                          onClick={() => handleReorder(order.id)}
                          disabled={reorderLoading === order.id}
                          className="flex items-center gap-2 bg-slate-900 text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#FF3041] transition-all disabled:opacity-50"
                        >
                          <RotateCcw className={`w-4 h-4 ${reorderLoading === order.id ? 'animate-spin' : ''}`} />
                          {reorderLoading === order.id ? "Adding..." : "Reorder"}
                        </button>
                        <button 
                          onClick={() => navigate(`/customer/complaints?orderId=${order.id}`)}
                          className="flex items-center gap-2 bg-white border-2 border-slate-100 text-slate-400 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:border-slate-900 hover:text-slate-900 transition-all"
                        >
                          <HelpCircle className="w-4 h-4" />
                          Support
                        </button>
                     </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}