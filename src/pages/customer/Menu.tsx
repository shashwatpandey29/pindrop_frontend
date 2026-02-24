import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "@/api/api";

interface Dish {
  id: number;
  restaurant_id: number;
  name: string;
  description?: string;
  price: number;
  availability: boolean;
  image_path?: string;
}

export default function Menu() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Advanced Button States
  const [addingId, setAddingId] = useState<number | null>(null);
  const [successId, setSuccessId] = useState<number | null>(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        if (!id) return;
        const res = await API.customer.getMenu(parseInt(id));
        setDishes(res.data);
      } catch (err: any) {
        setError(err.response?.data?.detail || "Failed to load menu.");
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [id]);

  const handleAddToCart = async (dishId: number) => {
    setAddingId(dishId);
    try {
      await API.customer.addToCart(dishId, 1);
      
      // Trigger success animation
      setSuccessId(dishId);
      setTimeout(() => setSuccessId(null), 2000); // Reset after 2 seconds
    } catch (err: any) {
      alert(err.response?.data?.detail || "Could not add to cart");
    } finally {
      setAddingId(null);
    }
  };

  if (error) {
    return (
      <div className="max-w-3xl mx-auto mt-8 p-6 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-4 text-red-800">
        <svg className="w-6 h-6 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <h3 className="font-bold text-lg">Menu Unavailable</h3>
          <p className="text-red-600 mt-1">{error}</p>
          <button onClick={() => navigate("/customer")} className="mt-4 text-sm font-bold underline hover:text-red-900">
            &larr; Back to Restaurants
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      
      {/* Sticky Glass Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md pb-4 pt-2 border-b border-gray-100 flex items-center gap-4">
        <button 
          onClick={() => navigate("/customer")}
          className="p-2.5 text-gray-700 bg-gray-50 border border-gray-200 rounded-full hover:bg-gray-100 hover:scale-105 transition-all"
          title="Go back"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Order Now</h1>
          <p className="text-sm font-medium text-gray-500 mt-0.5">Customize your perfect meal.</p>
        </div>
      </div>

      {loading ? (
        /* Modern Skeleton Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="bg-white rounded-3xl p-5 border border-gray-100 flex justify-between gap-4 animate-pulse">
              <div className="flex-1 space-y-4 py-2">
                <div className="h-5 bg-gray-200 rounded-md w-3/4"></div>
                <div className="h-5 bg-gray-200 rounded-md w-1/4"></div>
                <div className="h-3 bg-gray-100 rounded-md w-full mt-4"></div>
                <div className="h-3 bg-gray-100 rounded-md w-2/3"></div>
              </div>
              <div className="w-32 h-32 bg-gray-200 rounded-2xl shrink-0"></div>
            </div>
          ))}
        </div>
      ) : dishes.length === 0 ? (
        /* Premium Empty State */
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-300 text-center">
          <span className="text-6xl mb-4">🧑‍🍳</span>
          <p className="text-2xl font-bold text-gray-800 mb-2">The kitchen is prepping</p>
          <p className="text-gray-500 max-w-sm">
            This restaurant hasn't added any dishes to their digital menu yet.
          </p>
        </div>
      ) : (
        /* Dish Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dishes.map((dish) => (
            <div 
              key={dish.id} 
              className={`group bg-white rounded-3xl p-5 border border-gray-100 shadow-sm hover:shadow-xl hover:border-orange-100 transition-all duration-300 flex justify-between gap-4 ${
                !dish.availability ? "opacity-60 bg-gray-50 grayscale hover:shadow-none hover:border-gray-100" : ""
              }`}
            >
              {/* Dish Info (Left Side) */}
              <div className="flex-1 flex flex-col justify-center">
                <h3 className="text-xl font-bold text-gray-900 leading-tight mb-1">{dish.name}</h3>
                <span className="inline-block text-lg font-extrabold text-gray-800 mb-2">
                  ₹{dish.price.toFixed(2)}
                </span>
                
                {dish.description && (
                  <p className="text-sm text-gray-500 line-clamp-2 mt-1 pr-2 leading-relaxed">
                    {dish.description}
                  </p>
                )}
              </div>
              
              {/* Image & Action Button (Right Side) */}
              <div className="relative shrink-0 flex flex-col items-center justify-center">
                {dish.image_path ? (
                  <img 
                    src={dish.image_path} 
                    alt={dish.name} 
                    className="w-32 h-32 object-cover rounded-2xl shadow-sm bg-gray-100 group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-32 h-32 bg-orange-50 rounded-2xl shadow-sm flex items-center justify-center border border-orange-100">
                    <span className="text-3xl">🍲</span>
                  </div>
                )}

                {/* Overlapping Add Button (Zomato Style) */}
                <div className="absolute -bottom-4">
                  <button
                    onClick={() => handleAddToCart(dish.id)}
                    disabled={!dish.availability || addingId === dish.id || successId === dish.id}
                    className={`px-8 py-2 rounded-xl font-bold tracking-wide shadow-md transition-all duration-300 transform hover:-translate-y-0.5 ${
                      !dish.availability 
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed shadow-none" 
                        : successId === dish.id
                        ? "bg-green-500 text-white shadow-green-200"
                        : addingId === dish.id
                        ? "bg-orange-400 text-white shadow-orange-200 cursor-wait"
                        : "bg-white text-orange-600 border-2 border-orange-100 hover:bg-orange-50 hover:border-orange-200"
                    }`}
                  >
                    {!dish.availability 
                      ? "SOLD OUT" 
                      : successId === dish.id
                      ? "✓ ADDED"
                      : addingId === dish.id 
                      ? "..." 
                      : "ADD"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}