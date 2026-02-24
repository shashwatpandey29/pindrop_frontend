import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import ProtectedRoute from "@/routes/ProtectedRoute";
import DashboardLayout from "@/layouts/DashboardLayout";

// --- Auth Pages ---
import Login from "@/pages/Login";
import Register from "@/pages/Register";

// --- Admin Pages ---
import AdminStats from "@/pages/admin/Stats";
import AdminRestaurants from "@/pages/admin/Restaurants";

// --- Restaurant Owner Pages ---
import Dishes from "@/pages/owner/Dishes";
import OwnerOrders from "@/pages/owner/Orders";

// --- Customer Pages ---
import Restaurants from "@/pages/customer/Restaurants";
import Menu from "@/pages/customer/Menu";
import Cart from "@/pages/customer/Cart";
import CustomerOrders from "@/pages/customer/Orders";
import Complaints from "@/pages/customer/Complaints"; // <-- IMPORTED THIS

// --- Delivery Partner Pages ---
import DeliveryDashboard from "@/pages/delivery/Dashboard";

// --- Customer Care Pages ---
import CareDashboard from "@/pages/care/Complaints";

// Placeholder component for features you might add later (like offers)
function Placeholder({ title }: { title: string }) {
  return <h1 className="text-2xl font-bold p-6 text-gray-800">{title}</h1>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Dashboard Routes (Authenticated) */}
        <Route element={<DashboardLayout />}>
          
          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={<ProtectedRoute allowedRoles={["admin"]}><Outlet /></ProtectedRoute>}
          >
            <Route index element={<AdminStats />} />
            <Route path="restaurants" element={<AdminRestaurants />} />
            <Route path="offers" element={<Placeholder title="Platform Offers" />} />
          </Route>

          {/* Restaurant Owner Routes */}
          <Route 
            path="/owner" 
            element={<ProtectedRoute allowedRoles={["owner"]}><Outlet /></ProtectedRoute>}
          >
            <Route index element={<Placeholder title="My Restaurant Details" />} />
            <Route path="dishes" element={<Dishes />} />
            <Route path="orders" element={<OwnerOrders />} />
          </Route>

          {/* Customer Routes */}
          <Route 
            path="/customer" 
            element={<ProtectedRoute allowedRoles={["customer"]}><Outlet /></ProtectedRoute>}
          >
            <Route index element={<Restaurants />} />
            <Route path="restaurants/:id/menu" element={<Menu />} />
            <Route path="cart" element={<Cart />} />
            <Route path="orders" element={<CustomerOrders />} />
            {/* FIX: Changed from Placeholder to Complaints */}
            <Route path="complaints" element={<Complaints />} /> 
          </Route>

          {/* Delivery Partner Routes */}
          <Route 
            path="/delivery" 
            element={<ProtectedRoute allowedRoles={["delivery"]}><Outlet /></ProtectedRoute>}
          >
            <Route index element={<DeliveryDashboard />} />
            <Route path="status" element={<Navigate to="/delivery" replace />} />
          </Route>

          {/* Customer Care (Admin Support) Routes */}
          <Route 
            path="/care" 
            element={<ProtectedRoute allowedRoles={["care"]}><Outlet /></ProtectedRoute>}
          >
            <Route index element={<CareDashboard />} />
            <Route path="orders" element={<Placeholder title="Order Reference" />} />
          </Route>

        </Route>

        {/* 404 Page */}
        <Route path="*" element={
          <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
            <h1 className="text-6xl font-bold text-gray-800">404</h1>
            <p className="text-gray-500 mt-2">Page not found</p>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}