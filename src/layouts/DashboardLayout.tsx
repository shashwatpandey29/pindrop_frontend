import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
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
          // ADDED THIS BACK IN:
          { name: "Help Center", path: "/customer/complaints", icon: LifeBuoy },
        ];
      case "delivery":
        return [
          { name: "Runners", path: "/delivery", icon: Truck },
        ];
      case "care":
        return [
          { name: "Complaints", path: "/care", icon: LifeBuoy },
        ];
      default: return [];
    }
  };
  const navLinks = getNavLinks();
  const currentPath = navLinks.find(l => location.pathname === l.path || (l.path !== "/customer" && location.pathname.startsWith(l.path)));

  return (
    <div className="flex h-screen bg-[#FDFDFD] font-sans selection:bg-orange-100">
      
      {/* --- FLOATING SIDEBAR --- */}
      <aside className="w-24 md:w-72 bg-white m-4 mr-0 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col items-center md:items-stretch py-8 transition-all overflow-hidden">
        
        {/* Brand Logo */}
        <div className="px-8 mb-12 flex items-center gap-3">
          <div className="w-12 h-12 bg-[#FF3041] rounded-2xl flex items-center justify-center shadow-lg shadow-red-200 rotate-3">
            <MapPin className="text-white w-7 h-7 -rotate-3" />
          </div>
          <div className="hidden md:block">
            <h1 className="text-xl font-[1000] text-black tracking-tighter italic">
              PIN<span className="text-[#FF3041]">DROP</span>
            </h1>
            <div className="h-1 w-full bg-orange-400 rounded-full mt-[-4px]"></div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 space-y-4">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path || (link.path !== "/customer" && location.pathname.startsWith(link.path + "/"));
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center gap-4 px-6 py-4 rounded-3xl transition-all duration-300 group relative ${
                  isActive
                    ? "bg-black text-white shadow-xl translate-x-2"
                    : "text-gray-400 hover:bg-gray-50 hover:text-black"
                }`}
              >
                <Icon className={`w-6 h-6 ${isActive ? "text-orange-400" : "group-hover:text-[#FF3041]"}`} />
                <span className={`hidden md:block font-black text-sm uppercase tracking-tight`}>
                  {link.name}
                </span>
                {isActive && (
                    <div className="absolute -left-2 w-2 h-8 bg-[#FF3041] rounded-r-full"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout Section */}
        <div className="px-6 mt-auto">
          <div className="bg-orange-50 rounded-[2rem] p-4 hidden md:block border border-orange-100 mb-4">
              <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1">Active User</p>
              <p className="text-sm font-black text-gray-800 truncate">{user?.name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-gray-100 text-gray-500 hover:bg-red-500 hover:text-white transition-all font-black"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden md:block text-xs uppercase">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Modern Glass Header */}
        <header className="h-24 flex items-center justify-between px-12 z-20">
          <div className="flex items-center gap-4">
            <div className="bg-black text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
              {user?.role}
            </div>
            <h2 className="text-3xl font-[1000] text-gray-900 tracking-tighter">
              {currentPath?.name || "Hey there!"}
            </h2>
          </div>

          <div className="flex items-center gap-6">
            {/* Search Bar - Swiggy Style */}
            <div className="hidden lg:flex items-center bg-gray-100 rounded-full px-6 py-3 w-80 border border-transparent focus-within:border-orange-300 focus-within:bg-white transition-all">
               <Search className="w-4 h-4 text-gray-400 mr-3" />
               <input type="text" placeholder="Search for food..." className="bg-transparent outline-none text-sm font-bold w-full" />
            </div>

            {/* Notification & Location */}
            <div className="flex items-center gap-3">
              <div className="bg-white shadow-lg p-3 rounded-2xl border border-gray-100 cursor-pointer hover:scale-110 transition-transform relative">
                 <Bell className="w-6 h-6 text-gray-800" />
                 <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
              </div>
              <div className="bg-[#FF3041] text-white px-6 py-3 rounded-2xl shadow-lg shadow-red-200 hidden sm:flex items-center gap-2 cursor-pointer">
                 <MapPin className="w-4 h-4" />
                 <span className="text-sm font-black">{user?.pin_code}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Scroll Area */}
        <div className="flex-1 overflow-y-auto px-12 py-4 custom-scrollbar">
          <div className="animate-in slide-in-from-bottom-4 duration-700">
            <Outlet />
          </div>
        </div>
        
        {/* Background Decor */}
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-100/50 blur-[120px] rounded-full -z-10"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-red-100/30 blur-[100px] rounded-full -z-10"></div>
      </main>
    </div>
  );
}