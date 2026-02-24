import { useEffect, useState } from "react";
import { 
  Clock, CheckCircle2, XCircle, Play, 
  Truck, UtensilsCrossed, RefreshCw, User,
  AlertCircle
} from "lucide-react";
import API from "@/api/api";

export default function OwnerOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await API.owner.getOrders();
      setOrders(res.data);
    } catch (err: any) {
      setError(err.response?.status === 404 ? "Account not linked." : "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleUpdateStatus = async (orderId: number, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      await API.owner.updateOrderStatus(orderId, newStatus);
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, order_status: newStatus } : o));
    } catch (err: any) {
      alert(err.response?.data?.detail || "Update failed.");
    } finally { setUpdatingId(null); }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "Placed": return "bg-blue-500 text-white animate-pulse shadow-lg shadow-blue-200";
      case "Accepted": return "bg-indigo-500 text-white";
      case "Preparing": return "bg-orange-500 text-white";
      case "Out for Delivery": return "bg-purple-500 text-white";
      case "Delivered": return "bg-green-500 text-white";
      default: return "bg-slate-400 text-white";
    }
  };

  const getAvailableActions = (status: string) => {
    switch (status) {
      case "Placed": return [
        { label: "ACCEPT", status: "Accepted", icon: CheckCircle2, color: "bg-black hover:bg-green-600" },
        { label: "REJECT", status: "Rejected", icon: XCircle, color: "bg-white text-red-500 border-2 border-red-50" }
      ];
      case "Accepted": return [
        { label: "START COOKING", status: "Preparing", icon: Play, color: "bg-indigo-600 hover:bg-indigo-700" }
      ];
      case "Preparing": return [
        { label: "HAND OVER TO RIDER", status: "Out for Delivery", icon: Truck, color: "bg-[#FF3041] hover:bg-red-700" }
      ];
      default: return [];
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-96">
      <RefreshCw className="w-12 h-12 text-[#FF3041] animate-spin mb-4" />
      <p className="font-[1000] text-slate-400 uppercase tracking-widest text-xs">Fetching Live Feed...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto pb-20">
      
      {/* KDS Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <div className="flex items-center gap-2 mb-2">
             <div className="w-3 h-3 rounded-full bg-red-500 animate-ping"></div>
             <span className="text-xs font-black text-red-500 uppercase tracking-[0.3em]">Live Kitchen Feed</span>
          </div>
          <h1 className="text-5xl font-[1000] text-slate-900 tracking-tighter">
            Kitchen <span className="text-[#FF3041]">Display</span>
          </h1>
        </div>
        
        <button 
          onClick={fetchOrders}
          className="group bg-white border-2 border-slate-100 p-4 rounded-2xl hover:border-[#FF3041] transition-all flex items-center gap-3"
        >
          <RefreshCw className="w-5 h-5 text-slate-400 group-hover:rotate-180 transition-transform duration-500" />
          <span className="font-black text-xs uppercase tracking-widest text-slate-600">Refresh Feed</span>
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-slate-100">
           <UtensilsCrossed className="w-16 h-16 text-slate-200 mx-auto mb-6" />
           <h3 className="text-2xl font-black text-slate-300 uppercase italic">Kitchen is Silent</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {orders.map((order) => {
            const actions = getAvailableActions(order.order_status);
            return (
              <div key={order.id} className="relative bg-white rounded-[2.5rem] shadow-sm hover:shadow-2xl border border-slate-100 transition-all duration-500 flex flex-col overflow-hidden group">
                
                {/* Top Status Bar */}
                <div className={`h-3 ${getStatusStyles(order.order_status)}`} />

                <div className="p-8 flex-1">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Order ID</p>
                      <h2 className="text-2xl font-[1000] text-slate-900 tracking-tighter">#{order.id}</h2>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span className="text-xs font-black text-slate-900">
                        {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="flex items-center gap-3 mb-8 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                     <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                        <User className="w-5 h-5 text-slate-400" />
                     </div>
                     <div className="min-w-0">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</p>
                        <p className="font-black text-slate-800 truncate">{order.customer_name || "Guest User"}</p>
                     </div>
                  </div>

                  {/* Item List */}
                  <div className="space-y-4 mb-8">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <UtensilsCrossed className="w-3 h-3" /> Kitchen Ticket
                     </p>
                     <div className="space-y-3">
                        {order.items.map((item: any) => (
                          <div key={item.id} className="flex justify-between items-center group/item">
                            <span className="font-black text-slate-700">
                               <span className="text-[#FF3041] mr-2">x{item.quantity}</span>
                               {item.dish_name}
                            </span>
                            <div className="h-[1px] flex-1 mx-4 bg-slate-100 group-hover/item:bg-[#FF3041]/20 transition-colors"></div>
                          </div>
                        ))}
                     </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 bg-slate-50/50 border-t border-slate-100">
                  {actions.length > 0 ? (
                    <div className="flex gap-3">
                      {actions.map((action) => (
                        <button
                          key={action.status}
                          onClick={() => handleUpdateStatus(order.id, action.status)}
                          disabled={updatingId === order.id}
                          className={`flex-1 py-4 px-4 rounded-2xl font-[1000] text-[10px] tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-lg ${action.color} text-white disabled:opacity-50 active:scale-95`}
                        >
                          {updatingId === order.id ? <RefreshCw className="w-4 h-4 animate-spin" /> : <action.icon className="w-4 h-4" />}
                          {action.label}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3 p-3 bg-white rounded-2xl border border-slate-100">
                       <AlertCircle className="w-4 h-4 text-slate-400" />
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                         {order.order_status === "Out for Delivery" ? "With Rider" : "Completed"}
                       </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}