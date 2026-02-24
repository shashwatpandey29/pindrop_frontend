import { Link } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

export default function Sidebar() {
  const { user, logout } = useAuthStore();

  const roleLinks: Record<string, { name: string; path: string }[]> = {
    admin: [
      { name: "Dashboard", path: "/admin" },
      { name: "Restaurants", path: "/admin/restaurants" },
      { name: "Offers", path: "/admin/offers" },
    ],
    owner: [
      { name: "Orders", path: "/owner/orders" },
      { name: "Dishes", path: "/owner/dishes" },
    ],
    customer: [
      { name: "Browse", path: "/customer/restaurants" },
      { name: "Cart", path: "/customer/cart" },
      { name: "Orders", path: "/customer/orders" },
    ],
    delivery: [
      { name: "My Orders", path: "/delivery/orders" },
    ],
    care: [
      { name: "Complaints", path: "/care/complaints" },
    ],
  };

  const links = user ? roleLinks[user.role] : [];

  return (
    <div className="w-64 bg-white border-r p-6 flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold mb-6">PinDrop Eats</h2>
        <nav className="space-y-3">
          {links?.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="block text-gray-600 hover:text-black"
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>

      <button
        onClick={logout}
        className="text-red-500 text-sm mt-8"
      >
        Logout
      </button>
    </div>
  );
}