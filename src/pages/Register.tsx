import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import api from "@/api/axiosConfig";
import { 
  MapPin, User, ShoppingBag, Truck, 
  ShieldCheck, Headset, ArrowRight, Loader2, Mail, Lock 
} from "lucide-react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [pinCode, setPinCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const loginAction = useAuthStore((state) => state.setAuth);

  const roles = [
    { id: "customer", label: "Customer", icon: User, desc: "Order delicious food" },
    { id: "owner", label: "Owner", icon: ShoppingBag, desc: "Manage your kitchen" },
    { id: "delivery", label: "Partner", icon: Truck, desc: "Earn by delivering" },
    { id: "care", label: "Support", icon: Headset, desc: "Help our community" },
    { id: "admin", label: "Admin", icon: ShieldCheck, desc: "Platform control" },
  ];

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/register", {
        name, email, password, role, pin_code: pinCode,
      });
      const { access_token, user } = response.data;
      loginAction(user, access_token);

      const routes: Record<string, string> = {
        admin: "/admin", owner: "/owner", delivery: "/delivery",
        care: "/care", customer: "/customer",
      };
      navigate(routes[user.role] || "/customer");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      {/* --- LEFT SIDE: Sticky Info --- */}
      <div className="hidden lg:flex lg:w-[40%] bg-slate-900 p-16 flex-col justify-between sticky top-0 h-screen">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#FF3041] rounded-xl flex items-center justify-center rotate-3">
            <MapPin className="text-white w-6 h-6 -rotate-3" />
          </div>
          <h1 className="text-2xl font-[1000] text-white tracking-tighter italic">
            PIN<span className="text-[#FF3041]">DROP</span>
          </h1>
        </div>

        <div>
          <h2 className="text-5xl font-[1000] text-white tracking-tighter leading-tight mb-6">
            Start your <br />
            <span className="text-[#FF3041]">Journey</span> with us.
          </h2>
          <p className="text-slate-400 font-bold text-lg max-w-sm leading-relaxed">
            Join thousands of users who trust Pindrop for their daily food adventures.
          </p>
        </div>

        <div className="text-slate-500 text-sm font-bold">
          © 2026 Pindrop Eats Inc.
        </div>
      </div>

      {/* --- RIGHT SIDE: Scrollable Form --- */}
      <div className="flex-1 bg-gray-50/50 p-8 lg:p-20 overflow-y-auto">
        <div className="max-w-xl mx-auto space-y-10">
          <div>
            <h3 className="text-3xl font-[1000] text-slate-900 tracking-tighter">Create Account</h3>
            <p className="text-slate-500 font-bold mt-2">Pick your role and fill in the details below.</p>
          </div>

          {error && (
            <div className="p-4 text-sm font-bold text-red-700 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-8">
            {/* Role Selection Cards */}
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Select Account Type</label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {roles.map((r) => {
                  const Icon = r.icon;
                  const isSelected = role === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id)}
                      className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 ${
                        isSelected 
                          ? "border-[#FF3041] bg-white shadow-xl shadow-red-100 scale-105" 
                          : "border-slate-100 bg-white hover:border-slate-200 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <Icon className={`w-6 h-6 mb-2 ${isSelected ? "text-[#FF3041]" : "text-slate-400"}`} />
                      <span className={`text-[10px] font-black uppercase tracking-tighter ${isSelected ? "text-slate-900" : "text-slate-400"}`}>
                        {r.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Input Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-[#FF3041] transition-colors" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-100 rounded-2xl outline-none focus:border-[#FF3041] transition-all font-bold text-slate-700 shadow-sm"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Pin Code</label>
                <div className="relative group">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-[#FF3041] transition-colors" />
                  <input
                    type="text"
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-100 rounded-2xl outline-none focus:border-[#FF3041] transition-all font-bold text-slate-700 shadow-sm"
                    placeholder="226001"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-[#FF3041] transition-colors" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-100 rounded-2xl outline-none focus:border-[#FF3041] transition-all font-bold text-slate-700 shadow-sm"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-[#FF3041] transition-colors" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-100 rounded-2xl outline-none focus:border-[#FF3041] transition-all font-bold text-slate-700 shadow-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group w-full relative bg-slate-900 hover:bg-[#FF3041] text-white py-5 rounded-2xl font-[1000] text-sm uppercase tracking-widest shadow-xl transition-all duration-300 disabled:opacity-50"
            >
              <div className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </button>
          </form>

          <p className="text-center font-bold text-slate-500">
            Already a member?{" "}
            <Link to="/login" className="text-[#FF3041] hover:underline decoration-2 underline-offset-4">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}