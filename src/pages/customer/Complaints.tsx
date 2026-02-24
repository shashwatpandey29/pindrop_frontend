import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { 
  LifeBuoy, MessageSquare, AlertTriangle, 
  CheckCircle2, ArrowLeft, Send, History 
} from "lucide-react";
import API from "@/api/api";

export default function Complaints() {
  const [searchParams] = useSearchParams();
  const orderIdParam = searchParams.get("orderId");
  const navigate = useNavigate();

  const [orderId, setOrderId] = useState(orderIdParam || "");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.customer.raiseComplaint(parseInt(orderId), description);
      setSuccess(true);
      setTimeout(() => navigate("/customer/orders"), 3000);
    } catch (err: any) {
      alert(err.response?.data?.detail || "Could not file complaint.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-[2rem] flex items-center justify-center mb-6 animate-bounce">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h2 className="text-4xl font-[1000] text-slate-900 tracking-tighter">Issue Logged!</h2>
        <p className="text-slate-500 font-bold mt-2 max-w-sm">
          Our care team is already looking into Order #{orderId}. We'll make this right.
        </p>
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-8">Redirecting to orders...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center gap-4 mb-12">
        <button onClick={() => navigate(-1)} className="p-3 bg-white border border-slate-100 rounded-2xl shadow-sm hover:scale-110 transition-transform">
          <ArrowLeft className="w-5 h-5 text-slate-900" />
        </button>
        <div>
          <h1 className="text-4xl font-[1000] text-slate-900 tracking-tighter">Help <span className="text-[#FF3041]">Center</span></h1>
          <p className="text-slate-500 font-bold mt-1">Tell us what went wrong, we're here to help.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        
        {/* Support Form */}
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-2xl shadow-slate-200/50 space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Order Reference</label>
              <div className="relative">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-black text-sm">#</div>
                <input
                  type="number"
                  required
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="w-full pl-10 pr-6 py-5 bg-slate-50 border-2 border-transparent focus:border-[#FF3041] focus:bg-white rounded-[1.5rem] outline-none font-bold text-slate-800 transition-all"
                  placeholder="Order ID"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">What happened?</label>
              <textarea
                required
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent focus:border-[#FF3041] focus:bg-white rounded-[1.5rem] outline-none font-bold text-slate-800 transition-all resize-none"
                placeholder="Spilled food, missing items, or late delivery..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black hover:bg-[#FF3041] text-white py-6 rounded-[1.5rem] font-[1000] text-sm uppercase tracking-[0.2em] shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? "SENDING..." : "RAISE TICKET"}
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Info Sidebar */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#FF3041] rounded-[2.5rem] p-8 text-white shadow-xl shadow-red-100">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
               <LifeBuoy className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-[1000] tracking-tighter mb-2">Priority Support</h3>
            <p className="text-red-100 font-bold text-sm leading-relaxed">
              Complaints raised within 2 hours of delivery are handled with 
              <span className="text-white"> Instant Resolution.</span>
            </p>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 space-y-6">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Common Issues</h4>
            <div className="space-y-4">
               {[
                 { icon: AlertTriangle, text: "Missing Item", color: "text-orange-500 bg-orange-50" },
                 { icon: MessageSquare, text: "Wrong Order", color: "text-blue-500 bg-blue-50" },
                 { icon: History, text: "Late Delivery", color: "text-purple-500 bg-purple-50" }
               ].map((item, i) => (
                 <div key={i} className="flex items-center gap-4 group cursor-pointer">
                    <div className={`p-3 rounded-xl transition-transform group-hover:scale-110 ${item.color}`}>
                       <item.icon className="w-5 h-5" />
                    </div>
                    <span className="font-black text-slate-700 text-sm group-hover:text-[#FF3041] transition-colors">{item.text}</span>
                 </div>
               ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}