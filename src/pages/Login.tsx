import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import api from "@/api/axiosConfig";
import { MapPin, ArrowRight, Mail, Lock, Loader2 } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const loginAction = useAuthStore((state) => state.setAuth);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", { email, password });
      const { access_token, user } = response.data;

      loginAction(user, access_token);

      const routes: Record<string, string> = {
        admin: "/admin",
        owner: "/owner",
        delivery: "/delivery",
        care: "/care",
        customer: "/customer",
      };
      
      navigate(routes[user.role] || "/customer");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Check your email and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* --- LEFT SIDE: Brand Visuals --- */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-slate-900">
        <img 
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop" 
          alt="Delicious Food" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 scale-110 animate-pulse-slow"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
        
        <div className="relative z-10 flex flex-col justify-between p-16 w-full">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#FF3041] rounded-2xl flex items-center justify-center shadow-2xl rotate-3">
              <MapPin className="text-white w-7 h-7 -rotate-3" />
            </div>
            <h1 className="text-3xl font-[1000] text-white tracking-tighter italic">
              PIN<span className="text-[#FF3041]">DROP</span>
            </h1>
          </div>

          <div className="space-y-4">
            <h2 className="text-6xl font-[1000] text-white leading-tight tracking-tighter">
              Craving for <br />
              <span className="text-[#FF3041]">Excellence?</span>
            </h2>
            <p className="text-xl text-slate-300 font-medium max-w-md">
              The fastest food delivery management system in the pin code. Join the elite network.
            </p>
          </div>

          <div className="flex gap-4">
            <div className="h-1 w-20 bg-[#FF3041] rounded-full" />
            <div className="h-1 w-8 bg-slate-700 rounded-full" />
            <div className="h-1 w-8 bg-slate-700 rounded-full" />
          </div>
        </div>
      </div>

      {/* --- RIGHT SIDE: Login Form --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 bg-gray-50/50">
        <div className="w-full max-w-md space-y-10">
          <div className="space-y-2">
            <h3 className="text-4xl font-[1000] text-slate-900 tracking-tighter">Welcome back</h3>
            <p className="text-slate-500 font-bold">Sign in to continue your journey</p>
          </div>

          {error && (
            <div className="flex items-center gap-3 p-4 text-sm font-bold text-red-700 bg-red-50 border border-red-100 rounded-2xl animate-shake">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-[#FF3041] transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-100 rounded-2xl outline-none focus:border-[#FF3041] transition-all font-bold text-slate-700 shadow-sm"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">
                  Password
                </label>
                <a href="#" className="text-[10px] font-black text-[#FF3041] uppercase tracking-tighter hover:underline">Forgot?</a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-[#FF3041] transition-colors" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-100 rounded-2xl outline-none focus:border-[#FF3041] transition-all font-bold text-slate-700 shadow-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group w-full relative bg-slate-900 hover:bg-[#FF3041] text-white py-4 rounded-2xl font-[1000] text-sm uppercase tracking-widest shadow-xl shadow-slate-200 hover:shadow-red-200 transition-all duration-300 disabled:opacity-50 overflow-hidden"
            >
              <div className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>Enter Pindrop</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </button>
          </form>

          <p className="text-center font-bold text-slate-500">
            New here?{" "}
            <Link to="/register" className="text-[#FF3041] hover:underline decoration-2 underline-offset-4">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}