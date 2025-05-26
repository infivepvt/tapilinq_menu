import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { CartProvider } from "./context/CartContext";
import { ChatProvider } from "./context/ChatContext";
import NewOrderPage from "./pages/NewOrderPage";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import CartPage from "./pages/CartPage";
import socket from "./socket";
import useLoadTax from "./hooks/useLoadTax";

function App() {
  useEffect(() => {
    socket.emit("joinCustomer");
  }, []);

  const [tax, setTax] = useState(0);

  const { loadTax } = useLoadTax();

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await loadTax();
        setTax(parseFloat(data.taxPercentage));
        localStorage.setItem("tax", data.taxPercentage.toString());
        localStorage.setItem("showTax", data.showTax.toString());
      } catch (error) {
        console.log(error);
      }
    };
    load();
  }, []);

  return (
    <ThemeProvider>
      <CartProvider>
        <ChatProvider>
          <Router basename="/">
            <Routes>
              <Route path="/" element={<NewOrderPage />} />
              <Route path="/history" element={<OrderHistoryPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </ChatProvider>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;
