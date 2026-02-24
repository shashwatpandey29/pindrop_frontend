import { useEffect, useState } from "react";
import API from "@/api/api";

interface Restaurant {
  id: number;
  name: string;
  owner_id: number;
  status: string;
  pin_code: string;
  restaurant_fee: number;
}

export default function AdminRestaurants() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    owner_id: "",
    status: "active",
    pin_code: "",
    restaurant_fee: "40.00", // Default ₹40 fee
  });

  const fetchRestaurants = async () => {
    try {
      const res = await API.admin.getAllRestaurants();
      setRestaurants(res.data);
    } catch (err) {
      setError("Failed to load restaurants.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleAddRestaurant = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        owner_id: parseInt(formData.owner_id),
        status: formData.status,
        pin_code: formData.pin_code,
        restaurant_fee: parseFloat(formData.restaurant_fee),
      };

      const res = await API.admin.addRestaurant(payload);
      setRestaurants([...restaurants, res.data]); // Update UI
      setIsModalOpen(false); // Close Modal
      
      // Reset form
      setFormData({ name: "", owner_id: "", status: "active", pin_code: "", restaurant_fee: "40.00" });
    } catch (err: any) {
      alert(err.response?.data?.detail || "Failed to add restaurant. Check if the Owner ID is correct.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 animate-pulse">
        <p className="text-lg font-medium">Loading platform restaurants...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Restaurant Management</h1>
          <p className="text-gray-500 mt-1">Add new partners and manage their platform status.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white hover:bg-blue-700 font-semibold py-2.5 px-6 rounded-lg transition-colors flex items-center gap-2"
        >
          <span>+ Add Restaurant</span>
        </button>
      </div>

      {error && (
        <div className="p-4 text-red-700 bg-red-100 rounded-md border border-red-200">
          {error}
        </div>
      )}

      {/* Restaurants Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b text-gray-600 text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold">ID</th>
                <th className="p-4 font-semibold">Restaurant Name</th>
                <th className="p-4 font-semibold">Owner ID</th>
                <th className="p-4 font-semibold">Pin Code</th>
                <th className="p-4 font-semibold">Fee</th>
                <th className="p-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {restaurants.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    No restaurants registered on the platform yet.
                  </td>
                </tr>
              ) : (
                restaurants.map((rest) => (
                  <tr key={rest.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-gray-500 font-medium">#{rest.id}</td>
                    <td className="p-4 font-bold text-gray-800">{rest.name}</td>
                    <td className="p-4 text-gray-600">User #{rest.owner_id}</td>
                    <td className="p-4 text-gray-600">{rest.pin_code}</td>
                    <td className="p-4 text-gray-600">₹{rest.restaurant_fee.toFixed(2)}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase ${
                        rest.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}>
                        {rest.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Restaurant Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Register New Restaurant</h2>
            
            <form onSubmit={handleAddRestaurant} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Restaurant Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. Spice Route"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Owner User ID</label>
                  <input
                    type="number"
                    required
                    value={formData.owner_id}
                    onChange={(e) => setFormData({ ...formData, owner_id: e.target.value })}
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. 2"
                  />
                  <p className="text-xs text-gray-500 mt-1">The ID of the registered 'owner' user.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pin Code</label>
                  <input
                    type="text"
                    required
                    value={formData.pin_code}
                    onChange={(e) => setFormData({ ...formData, pin_code: e.target.value })}
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. 226001"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Fee (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.restaurant_fee}
                    onChange={(e) => setFormData({ ...formData, restaurant_fee: e.target.value })}
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 pt-4 mt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 font-semibold"
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}