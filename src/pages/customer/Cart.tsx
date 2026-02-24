import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ShoppingBag, Trash2, MapPin, ChevronRight, 
  Info, ShieldCheck, CreditCard, Ticket 
} from "lucide-react";
import API from "@/api/api";

export default function Cart() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentMode, setPaymentMode] = useState("Cash on Delivery");
  
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const res = await API.customer.getCart();
      setCartItems(res.data);
    } catch (err: any) {
      setError("Failed to load your cart.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCart(); }, []);

  const handleRemove = async (itemId: number) => {
    try {
      await API.customer.removeFromCart(itemId);
      setCartItems((prev) => prev.filter((item) => item.id !== itemId));
    } catch (err) { alert("Failed to remove item."); }
  };

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    try {
      await API.customer.checkout(paymentMode);
      navigate("/customer/orders");
    } catch (err: any) {
      alert(err.response?.data?.detail || "Checkout failed.");
    } finally { setCheckoutLoading(false); }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-96">
      <div className="w-12 h-12 border-4 border-[#FF3041] border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 font-black text-slate-400 uppercase tracking-widest text-xs">Checking your bag...</p>
    </div>
  );

  if (cartItems.length === 0) return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center">
      <div className="w-56 h-56 bg-slate-50 rounded-full flex items-center justify-center mb-6">
        <ShoppingBag className="w-24 h-24 text-slate-200" strokeWidth={1} />
      </div>
      <h2 className="text-3xl font-[1000] text-slate-900 tracking-tighter">Your cart is empty</h2>
      <p className="text-slate-500 font-bold mt-2 mb-8">Good food is always just a few clicks away!</p>
      <button
        onClick={() => navigate("/customer")}
        className="bg-[#FF3041] text-white font-[1000] py-4 px-10 rounded-2xl shadow-xl shadow-red-200 hover:scale-105 transition-transform"
      >
        BROWSE RESTAURANTS
      </button>
    </div>
  );

  const subtotal = cartItems.reduce((sum, item) => sum + item.dish_price * item.quantity, 0);
  const deliveryFee = 25.00;
  const platformFee = 5.00;
  const restaurantName = cartItems[0]?.restaurant_name;

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* --- LEFT: Items Section --- */}
        <div className="flex-1 space-y-6">
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-2xl">
                  🍳
                </div>
                <div>
                  <h2 className="text-2xl font-[1000] text-slate-900 tracking-tighter">{restaurantName}</h2>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Selected Delicacies</p>
                </div>
              </div>
              <button 
                onClick={() => navigate(-1)}
                className="text-xs font-black text-[#FF3041] uppercase tracking-widest hover:underline"
              >
                Add More
              </button>
            </div>

            <div className="divide-y divide-slate-50">
              {cartItems.map((item) => (
                <div key={item.id} className="p-8 flex items-center gap-6 group">
                  <div className="flex-1">
                    <h3 className="text-lg font-[1000] text-slate-800 tracking-tight">{item.dish_name}</h3>
                    <p className="text-sm font-bold text-slate-400 mt-1">
                      ₹{item.dish_price.toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                  <div className="flex items-center gap-8">
                    <p className="text-lg font-[1000] text-slate-900">₹{(item.dish_price * item.quantity).toFixed(2)}</p>
                    <button 
                      onClick={() => handleRemove(item.id)}
                      className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Note */}
          <div className="bg-blue-50/50 border border-blue-100 rounded-[2rem] p-6 flex items-center gap-4">
             <div className="p-3 bg-white rounded-xl shadow-sm">
                <ShieldCheck className="w-6 h-6 text-blue-600" />
             </div>
             <div>
                <p className="text-xs font-black text-blue-900 uppercase tracking-widest">Safe Delivery</p>
                <p className="text-sm font-bold text-blue-700/70">Our partner will follow all safety protocols during delivery.</p>
             </div>
          </div>
        </div>

        {/* --- RIGHT: Summary Section --- */}
        <div className="w-full lg:w-[400px] space-y-6">
          <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 p-10 space-y-8">
            <h2 className="text-2xl font-[1000] text-slate-900 tracking-tighter flex items-center gap-2">
               <Ticket className="w-6 h-6 text-[#FF3041]" />
               Bill Details
            </h2>
            
            <div className="space-y-4 font-bold">
              <div className="flex justify-between text-slate-400 text-sm">
                <span>Item Total</span>
                <span className="text-slate-900 font-black">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400 text-sm">
                <span className="flex items-center gap-1">Delivery Fee <Info className="w-3 h-3"/></span>
                <span className="text-slate-900 font-black">₹{deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400 text-sm">
                <span>Platform Fee</span>
                <span className="text-slate-900 font-black">₹{platformFee.toFixed(2)}</span>
              </div>
              <div className="pt-4 border-t border-slate-100 flex justify-between text-2xl font-[1000] text-slate-900 tracking-tighter">
                <span>Total to Pay</span>
                <span className="text-[#FF3041]">₹{(subtotal + deliveryFee + platformFee).toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Selection */}
            <div className="bg-slate-50 p-6 rounded-[2rem] space-y-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <CreditCard className="w-3 h-3" /> Payment Mode
              </p>
              <select 
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 font-black text-sm text-slate-700 outline-none focus:border-[#FF3041] transition-all"
              >
                <option>Cash on Delivery</option>
                <option>UPI / PhonePe / GPay</option>
                <option>Credit / Debit Card</option>
              </select>
            </div>

            <button
              onClick={handleCheckout}
              disabled={checkoutLoading}
              className="w-full bg-[#FF3041] hover:bg-black text-white font-[1000] py-5 rounded-[2rem] shadow-xl shadow-red-200 hover:shadow-slate-200 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {checkoutLoading ? "PROCESSING..." : "PLACE ORDER"}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 bg-slate-900 rounded-[2rem] text-white flex items-center gap-4">
             <div className="p-3 bg-white/10 rounded-xl">
                <MapPin className="w-5 h-5 text-orange-400" />
             </div>
             <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Delivering to</p>
                <p className="text-sm font-black truncate">Home • {user?.pin_code || "Saved Area"}</p>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}