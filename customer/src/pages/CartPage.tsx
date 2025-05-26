import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import CartSummary from "../components/cart/CartSummary";
import { useCart } from "../context/CartContext";
import { Order } from "../types";
import ChatPopup from "../components/ui/ChatPopup";
import usePlaceOrder from "../hooks/usePlaceOrder";
import toast from "react-hot-toast";
import socket from "../socket";

const CartPage: React.FC = () => {
  const { cart, clearCart, totalAmount, subTotal } = useCart();
  const navigate = useNavigate();
  const { placeOrder } = usePlaceOrder();
  const tableNumber = localStorage.getItem("table") || "1";

  const handlePlaceOrder = async (
    tableNumber: number,
    customerName: string
  ) => {
    const tbl = localStorage.getItem("table") || "1";
    // In a real app, this would send the order to a backend
    const newOrder: Order = {
      items: [...cart],
      tableNumber: tbl,
      totalAmount,
      customerName,
      subTotal,
    };

    try {
      const { data } = await placeOrder(newOrder);
      socket.emit("newOrder", data.orderId);
      clearCart(data.orderId);
      toast.success("Order placed success");
    } catch (error: any) {
      toast.error(error.message);
    }

    // Mock adding to orders
    // (In a real app, this would be handled by the backend)

    // Clear the cart

    // Show success message and redirect
    navigate("/history");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Header />

      <main className="flex-grow pt-20 pb-16">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 text-center">
            Table {tableNumber}
          </h1>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center md:text-left">
            Your Order
          </h2>

          <div className="max-w-2xl mx-auto">
            <CartSummary onPlaceOrder={handlePlaceOrder} />

            {cart.length > 0 && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => navigate("/")}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <ChatPopup />
      <Footer />
    </div>
  );
};

export default CartPage;
