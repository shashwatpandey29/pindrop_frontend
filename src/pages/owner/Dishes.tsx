import { useEffect, useState } from "react";
import { 
  Plus, Utensils, IndianRupee, ToggleLeft, 
  ToggleRight, Trash2, Camera, X, CheckCircle2 
} from "lucide-react";
import API from "@/api/api";

interface Restaurant {
  id: number;
  name: string;
  pin_code: string;
}

interface Dish {
  id: number;
  restaurant_id: number;
  name: string;
  description?: string;
  price: number;
  availability: boolean;
  image_path?: string;
}

export default function Dishes() {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDish, setNewDish] = useState({
    name: "",
    description: "",
    price: "",
    availability: true,
    image_path: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const restRes = await API.owner.getRestaurant();
        setRestaurant(restRes.data);
        const dishRes = await API.owner.getDishes();
        setDishes(dishRes.data);
      } catch (err: any) {
        setError(err.response?.status === 404 
          ? "No restaurant is linked to your account. Contact Admin." 
          : "Failed to load menu.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddDish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restaurant) return;

    try {
      const payload = {
        restaurant_id: restaurant.id,
        name: newDish.name,
        description: newDish.description,
        price: parseFloat(newDish.price),
        availability: newDish.availability,
        image_path: newDish.image_path || null,
      };
      const res = await API.owner.addDish(payload);
      setDishes([...dishes, res.data]);
      setIsModalOpen(false);
      setNewDish({ name: "", description: "", price: "", availability: true, image_path: "" });
    } catch (err: any) {
      alert(err.response?.data?.detail || "Failed to add dish.");
    }
  };

  const toggleAvailability = async (dish: Dish) => {
    try {
      const updatedDish = { ...dish, availability: !dish.availability };
      await API.owner.updateDish(dish.id, updatedDish);
      setDishes(dishes.map((d) => (d.id === dish.id ? updatedDish : d)));
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-96">
      <div className="w-12 h-12 border-4 border-[#FF3041] border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 font-black text-slate-400 uppercase tracking-widest text-xs">Syncing Kitchen...</p>
    </div>
  );

  if (error || !restaurant) return (
    <div className="max-w-xl mx-auto mt-20 p-10 text-center bg-white rounded-[2.5rem] shadow-xl border border-red-50">
      <div className="w-20 h-20 bg-red-50 text-[#FF3041] rounded-3xl flex items-center justify-center mx-auto mb-6">
        <Utensils className="w-10 h-10" />
      </div>
      <h2 className="text-3xl font-[1000] text-slate-900 tracking-tighter">Kitchen Not Set</h2>
      <p className="text-slate-500 font-bold mt-4 leading-relaxed">{error}</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <div className="w-2 h-2 rounded-full bg-green-500"></div>
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Live Menu</span>
          </div>
          <h1 className="text-4xl font-[1000] text-slate-900 tracking-tighter">
            Manage <span className="text-[#FF3041]">Dishes</span>
          </h1>
          <p className="text-slate-500 font-bold mt-1">
            Updating menu for <span className="text-black">{restaurant.name}</span>
          </p>
        </div>
        
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-black text-white hover:bg-[#FF3041] px-8 py-4 rounded-2xl font-[1000] text-sm uppercase tracking-widest transition-all shadow-xl shadow-slate-200 flex items-center gap-3 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Add Item
        </button>
      </div>

      {/* Grid */}
      {dishes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
             <Utensils className="text-slate-300 w-8 h-8" />
          </div>
          <p className="text-xl font-black text-slate-400">Your kitchen is empty</p>
          <button onClick={() => setIsModalOpen(true)} className="mt-4 text-[#FF3041] font-black hover:underline">Add your first dish &rarr;</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dishes.map((dish) => (
            <div 
              key={dish.id} 
              className={`group bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 ${!dish.availability ? 'bg-slate-50/50 grayscale' : ''}`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-2xl ${dish.availability ? 'bg-orange-50 text-orange-500' : 'bg-slate-200 text-slate-400'}`}>
                  <Utensils className="w-6 h-6" />
                </div>
                <button
                  onClick={() => toggleAvailability(dish)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    dish.availability 
                    ? "bg-green-50 text-green-600 border border-green-100" 
                    : "bg-red-50 text-red-600 border border-red-100"
                  }`}
                >
                  {dish.availability ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                  {dish.availability ? "Available" : "Stock Out"}
                </button>
              </div>

              <div className="space-y-2 mb-8">
                <h3 className="text-2xl font-[1000] text-slate-900 tracking-tighter leading-none group-hover:text-[#FF3041] transition-colors">
                  {dish.name}
                </h3>
                <div className="flex items-center gap-1 text-slate-900">
                   <IndianRupee className="w-4 h-4" strokeWidth={3} />
                   <span className="text-xl font-black">{dish.price.toFixed(2)}</span>
                </div>
                <p className="text-sm font-bold text-slate-400 line-clamp-2 leading-relaxed">
                  {dish.description || "No description provided for this item."}
                </p>
              </div>

              <div className="flex items-center gap-3 pt-6 border-t border-slate-50">
                <button className="flex-1 bg-slate-900 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#FF3041] transition-colors">Edit Item</button>
                <button className="p-3 text-slate-300 hover:text-red-500 transition-colors"><Trash2 className="w-5 h-5" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modern Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-6 z-[100] animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-10">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-[1000] text-slate-900 tracking-tighter">New <span className="text-[#FF3041]">Creation</span></h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                   <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>
              
              <form onSubmit={handleAddDish} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Dish Name</label>
                  <input
                    required
                    value={newDish.name}
                    onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
                    className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-[#FF3041] focus:bg-white rounded-2xl outline-none font-bold text-slate-700 transition-all"
                    placeholder="e.g. Flaming Peri Peri Pasta"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Price (₹)</label>
                    <input
                      type="number"
                      required
                      value={newDish.price}
                      onChange={(e) => setNewDish({ ...newDish, price: e.target.value })}
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-[#FF3041] focus:bg-white rounded-2xl outline-none font-bold text-slate-700 transition-all"
                      placeholder="299"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Thumbnail</label>
                    <div className="flex items-center justify-center w-full h-[58px] bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:text-[#FF3041] hover:border-[#FF3041] cursor-pointer transition-all">
                       <Camera className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                  <textarea
                    rows={3}
                    value={newDish.description}
                    onChange={(e) => setNewDish({ ...newDish, description: e.target.value })}
                    className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-[#FF3041] focus:bg-white rounded-2xl outline-none font-bold text-slate-700 transition-all resize-none"
                    placeholder="Briefly describe the ingredients and taste..."
                  />
                </div>

                <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-2xl border border-orange-100">
                  <input
                    type="checkbox"
                    id="availability"
                    checked={newDish.availability}
                    onChange={(e) => setNewDish({ ...newDish, availability: e.target.checked })}
                    className="w-5 h-5 rounded-lg text-[#FF3041] focus:ring-[#FF3041]"
                  />
                  <label htmlFor="availability" className="text-xs font-black text-orange-700 uppercase">List on menu instantly</label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#FF3041] text-white py-5 rounded-2xl font-[1000] text-sm uppercase tracking-widest shadow-xl shadow-red-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Save to Kitchen
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}