import api from "./axiosConfig"; // Assuming your axios instance is here

// --- Types (Simplified based on your Pydantic schemas) ---
export interface OrderItem {
  dish_id: number;
  quantity: number;
  price: number;
  dish_name?: string;
}

export interface Order {
  id: number;
  total_amount: number;
  order_status: string;
  items: OrderItem[];
  restaurant_name?: string;
}

// --- API Service Object ---
const API = {
  // ── AUTH ──
  auth: {
    me: () => api.get("/auth/me"),
    getNotifications: () => api.get("/notifications"),
    markNotificationsRead: () => api.put("/notifications/read"),
  },

  // ── CUSTOMER ──
  customer: {
    getRestaurants: () => api.get("/customer/restaurants"),
    getMenu: (restId: number) => api.get(`/customer/restaurants/${restId}/menu`),
    getCart: () => api.get("/customer/cart"),
    addToCart: (dishId: number, quantity: number) => 
      api.post("/customer/cart", { dish_id: dishId, quantity }),
    removeFromCart: (itemId: number) => api.delete(`/customer/cart/${itemId}`),
    clearCart: () => api.delete("/customer/cart"),
    getOffers: (restId?: number) => 
      api.get("/customer/offers", { params: { restaurant_id: restId } }),
    checkout: (paymentMode: string, offerId?: number) => 
      api.post("/customer/checkout", { payment_mode: paymentMode, offer_id: offerId }),
    getOrders: () => api.get("/customer/orders"),
    reorder: (orderId: number) => api.post(`/customer/orders/${orderId}/reorder`),
    raiseComplaint: (orderId: number, description: string) => 
      api.post("/customer/complaints", { order_id: orderId, description }),
  },

  // ── RESTAURANT OWNER ──
  owner: {
    getRestaurant: () => api.get("/owner/restaurant"),
    getDishes: () => api.get("/owner/dishes"),
    addDish: (data: any) => api.post("/owner/dishes", data),
    updateDish: (id: number, data: any) => api.put(`/owner/dishes/${id}`, data),
    getOrders: () => api.get("/owner/orders"),
    updateOrderStatus: (orderId: number, status: string) => 
      api.put(`/owner/orders/${orderId}/status`, { status }),
    getOffers: () => api.get("/owner/offers"),
    createOffer: (data: any) => api.post("/owner/offers", data),
  },

  // ── DELIVERY PARTNER ──
  delivery: {
    getStatus: () => api.get("/delivery/status"),
    toggleAvailability: () => api.put("/delivery/availability"),
    getAssignedOrders: () => api.get("/delivery/orders"),
    markDelivered: (orderId: number) => api.put(`/delivery/orders/${orderId}/deliver`),
  },

  // ── ADMIN ──
  admin: {
    getStats: () => api.get("/admin/stats"),
    getAllRestaurants: () => api.get("/admin/restaurants"),
    addRestaurant: (data: any) => api.post("/admin/restaurants", data),
    getPlatformOffers: () => api.get("/admin/offers"),
    createPlatformOffer: (data: any) => api.post("/admin/offers", data),
  },

  // ── CUSTOMER CARE ──
  care: {
    getComplaints: () => api.get("/care/complaints"),
    updateComplaint: (id: number, status: string, notes: string) => 
      api.put(`/care/complaints/${id}`, { status, resolution_notes: notes }),
    cancelOrder: (orderId: number) => api.put(`/care/orders/${orderId}/cancel`),
  }
};

export default API;