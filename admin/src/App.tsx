import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useTheme } from "./hooks/useTheme";
import { useAuth } from "./stores/auth";

import Login from "./pages/Login";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Users from "./pages/Users";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./routes/ProtectedRoute";
import Tables from "./pages/tables";
import socket from "./socket";
import Settings from "./pages/Settings";

function App() {
  const { theme } = useTheme();
  const { isAuthenticated } = useAuth();

  // Apply theme class to body element
  useEffect(() => {
    document.body.className =
      theme === "dark" ? "dark bg-gray-900" : "bg-gray-50";
  }, [theme]);

  useEffect(() => {
    // socket.on("connect", () => {
    socket.emit("joinAdmin");
    // });
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="orders" element={<Orders />} />
        <Route path="orders/:id" element={<OrderDetails />} />
        <Route path="products" element={<Products />} />
        <Route path="categories" element={<Categories />} />
        <Route path="tables" element={<Tables />} />
        <Route path="users" element={<Users />} />
        <Route path="chat" element={<Chat />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
