import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "@/api/api";

interface Restaurant {
  id: number;
  name: string;
  owner_id: number;
  status: string;
  pin_code: string;
  restaurant_fee: number;
}

export default function Restaurants() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await API.customer.getRestaurants();
        setRestaurants(res.data);
      } catch (err: any) {
        setError("Failed to load restaurants. Please try refreshing.");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  if (error) {
    return (
      <div className="max-w-3xl mx-auto mt-8 p-6 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-4 text-red-800">
        <svg className="w-6 h-6 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <h3 className="font-bold text-lg">Oops, something went wrong</h3>
          <p className="text-red-600 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Hungry? 🍕</h1>
          <p className="text-lg text-gray-500 mt-2 font-medium">
            Discover active spots delivering right to your door.
          </p>
        </div>
      </div>

      {loading ? (
        /* Skeleton Loading Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
              <div className="h-44 bg-gray-200"></div>
              <div className="p-6 space-y-4">
                <div className="h-6 bg-gray-200 rounded-md w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded-md w-1/2"></div>
                <div className="h-12 bg-gray-100 rounded-xl mt-4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : restaurants.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20 px-4 bg-white rounded-3xl shadow-sm border border-dashed border-gray-300 text-center">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">No restaurants in your area</h3>
          <p className="text-gray-500 max-w-md">
            We are expanding rapidly! Check back soon to see new partners delivering to your pin code.
          </p>
        </div>
      ) : (
        /* Restaurant Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {restaurants.map((rest) => (
            <div 
              key={rest.id} 
              className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1 flex flex-col"
            >
              {/* Image Banner Area */}
              <div className="h-44 relative bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center overflow-hidden">
                {/* Status Badge floating over image */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 capitalize">
                  <span className={`w-2 h-2 rounded-full ${rest.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  {rest.status}
                </div>
                {/* Decorative icon for placeholder */}
                <svg className="w-16 h-16 text-white/30" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z" />
                </svg>
              </div>
              
              {/* Content Area */}
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-2xl font-bold text-gray-900 line-clamp-1 mb-3 group-hover:text-orange-600 transition-colors">
                  {rest.name}
                </h3>
                
                <div className="flex items-center text-gray-600 mb-6 flex-1 bg-gray-50 rounded-lg p-3">
                  <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="text-sm font-medium">
                    Delivery Fee: <strong className="text-gray-900">₹{rest.restaurant_fee.toFixed(2)}</strong>
                  </span>
                </div>
                
                <button
                  onClick={() => navigate(`/customer/restaurants/${rest.id}/menu`)}
                  className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white hover:bg-orange-600 font-bold py-3.5 px-4 rounded-xl transition-all duration-200"
                >
                  <span>View Menu</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}