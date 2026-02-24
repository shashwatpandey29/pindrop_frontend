import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import Scene3D from "@/components/ui/Scene3D";
import { 
  LayoutDashboard, Utensils, ShoppingBag, MapPin, 
  LogOut, ClipboardList, LifeBuoy, TrendingUp, 
  Truck, Bell, User, Search
} from "lucide-react";

export default function DashboardLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getNavLinks = () => {
    if (!user) return [];
    switch (user.role) {
      case "admin":
        return [
          { name: "Analytics", path: "/admin", icon: TrendingUp },
          { name: "Restaurants", path: "/admin/restaurants", icon: Utensils },
        ];
      case "owner":
        return [
          { name: "Kitchen", path: "/owner", icon: LayoutDashboard },
          { name: "Manage Menu", path: "/owner/dishes", icon: Utensils },
          { name: "Live Orders", path: "/owner/orders", icon: ClipboardList },
        ];
      case "customer":
        return [
          { name: "Order Now", path: "/customer", icon: Utensils },
          { name: "My Cart", path: "/customer/cart", icon: ShoppingBag },
          { name: "History", path: "/customer/orders", icon: ClipboardList },
          { name: "Help Center", path: "/customer/complaints", icon: LifeBuoy },
        ];
      case "delivery":
        return [{ name: "Runners", path: "/delivery", icon: Truck }];
      case "care":
        return [{ name: "Complaints", path: "/care", icon: LifeBuoy }];
      default: return [];
    }
  };

  const navLinks = getNavLinks();
  const currentPath = navLinks.find(l => location.pathname === l.path || (l.path !== "/customer" && location.pathname.startsWith(l.path)));

  return (
    <div className="flex h-screen w-full font-sans selection:bg-red-500/30 overflow-hidden relative text-white">
      
      {/* --- ELITE 3D BACKGROUND --- */}
      <Scene3D />
      
      {/* --- DARK FROSTED SIDEBAR --- */}
      <aside className="w-24 md:w-72 bg-white/5 backdrop-blur-3xl m-4 mr-0 rounded-[2.5rem] border border-white/10 flex flex-col items-center md:items-stretch py-8 transition-all z-30 shadow-2xl shadow-black/50">
        
        <div className="px-8 mb-12 flex items-center gap-3">
          <div className="w-12 h-12 bg-[#FF3041] rounded-2xl flex items-center justify-center shadow-lg shadow-red-900/20 rotate-3 transition-transform hover:rotate-12 cursor-pointer">
            <MapPin className="text-white w-7 h-7 -rotate-3" />
          </div>
          <div className="hidden md:block">
            <h1 className="text-xl font-[1000] text-white tracking-tighter italic uppercase leading-none">
              PIN<span className="text-[#FF3041]">DROP</span>
            </h1>
            <div className="h-0.5 w-full bg-[#FF3041] rounded-full mt-1 opacity-50"></div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-3">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path || (link.path !== "/customer" && location.pathname.startsWith(link.path + "/"));
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center gap-4 px-6 py-4 rounded-3xl transition-all duration-300 group relative ${
                  isActive
                    ? "bg-white text-black shadow-xl translate-x-2"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <link.icon className={`w-6 h-6 transition-colors ${isActive ? "text-[#FF3041]" : "group-hover:text-[#FF3041]"}`} />
                <span className={`hidden md:block font-[1000] text-[10px] uppercase tracking-[0.2em]`}>
                  {link.name}
                </span>
                {isActive && <div className="absolute -left-2 w-2 h-8 bg-[#FF3041] rounded-r-full shadow-[0_0_15px_#FF3041]"></div>}
              </Link>
            );
          })}
        </nav>

        <div className="px-6 mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-red-500 hover:text-white transition-all font-black text-gray-500"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden md:block text-[10px] uppercase tracking-widest">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-24 flex items-center justify-between px-12 z-20">
          <div className="flex items-center gap-4">
            <div className="bg-[#FF3041] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-red-900/20">
              {user?.role}
            </div>
            <h2 className="text-3xl font-[1000] text-white tracking-tighter capitalize">
              {currentPath?.name || "Dashboard"}
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center bg-white/5 backdrop-blur-md rounded-full px-6 py-3 w-80 border border-white/10 focus-within:bg-white/10 focus-within:border-white/20 transition-all">
               <Search className="w-4 h-4 text-gray-400 mr-3" />
               <input type="text" placeholder="Search insights..." className="bg-transparent outline-none text-sm font-bold w-full text-white placeholder:text-gray-500" />
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-white/5 backdrop-blur-md shadow-sm p-3 rounded-2xl border border-white/10 cursor-pointer hover:bg-white/10 transition-all relative">
                 <Bell className="w-6 h-6 text-gray-400" />
                 <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#080808]"></span>
              </div>
              <div className="bg-white text-black px-6 py-3 rounded-2xl shadow-lg shadow-white/5 hidden sm:flex items-center gap-2 cursor-pointer hover:scale-105 transition-all">
                 <MapPin className="w-4 h-4 text-[#FF3041]" />
                 <span className="text-sm font-black tracking-tighter">{user?.pin_code}</span>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-12 py-4 custom-scrollbar relative z-10">
          <div className="animate-in slide-in-from-bottom-4 duration-700">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}