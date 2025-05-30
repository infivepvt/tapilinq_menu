import React, { useEffect, useState } from "react";
import { X, ShoppingBag } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

interface CartSummaryProps {
  onPlaceOrder: () => void;
}

const CartSummary: React.FC<CartSummaryProps> = ({ onPlaceOrder }) => {
  const { cart, removeFromCart, totalAmount, subTotal } = useCart();
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [taxShown, setTaxShown] = useState(true);
  const [scShown, setScShown] = useState(true);
  const [sc, setSc] = useState(0);
  const [tax, setTax] = useState(0);

  useEffect(() => {
    const taxData = localStorage.getItem("tax") || "0";
    const showTaxData = localStorage.getItem("showTax") || "true";
    setTax(parseFloat(taxData));
    setTaxShown(JSON.parse(showTaxData) === true);

    const scData = localStorage.getItem("sc") || "0";
    const showscData = localStorage.getItem("scp") || "true";
    setSc(parseFloat(scData));
    setScShown(JSON.parse(showscData) === true);
  }, []);

  const handlePlaceOrder = () => {
    setError("");
    setIsLoading(true);
    try {
      onPlaceOrder();
      toast.success("Order placed successfully!", {
        style: {
          background: "#10B981",
          color: "#fff",
        },
      });
    } catch (err) {
      setError("Failed to place order. Please try again.");
    } finally {
      setTimeout(() => setIsLoading(false), 1000); // Simulate async action
    }
  };

  const handleRemoveItem = (index: number, itemName: string) => {
    removeFromCart(index);
    toast.success(`${itemName} removed from cart`, {
      style: {
        background: "#10B981",
        color: "#fff",
      },
    });
  };

  if (cart.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl p-10 border border-gray-200 dark:border-gray-700 max-w-2xl mx-auto"
      >
        <div className="flex flex-col items-center justify-center py-12">
          <ShoppingBag
            size={80}
            className="text-blue-500 dark:text-blue-400 mb-6 animate-bounce"
          />
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Your Cart is Empty
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-center max-w-md mb-6">
            Explore our delicious menu and add some items to start your order!
          </p>
          <a
            href="/"
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
            aria-label="Browse the menu"
          >
            Browse Menu
          </a>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700 max-w-2xl mx-auto"
    >
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Order Summary
      </h2>

      <AnimatePresence>
        <div className="space-y-6 mb-8">
          {cart.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-between border-b border-gray-300 dark:border-gray-600 pb-4 bg-white dark:bg-gray-800 rounded-lg px-4 py-3 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex-grow">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {item.quantity} × {item.product.name}
                  </h3>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    Rs.{" "}
                    {(
                      (parseFloat(item.variant.price) +
                        item.addedIngredients.reduce(
                          (acc, ing) => acc + ing.price,
                          0
                        ) -
                        item.removedIngredients.reduce(
                          (acc, ing) => acc + ing.price,
                          0
                        )) *
                      item.quantity
                    ).toFixed(2)}
                  </span>
                </div>
                {(item.addedIngredients.length > 0 ||
                  item.removedIngredients.length > 0 ||
                  item.specialNote) && (
                  <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    {item.addedIngredients.length > 0 && (
                      <div className="text-green-500 dark:text-green-400">
                        +{" "}
                        {item.addedIngredients
                          .map((ingredient) => ingredient.name)
                          .join(", ")}
                      </div>
                    )}
                    {item.removedIngredients.length > 0 && (
                      <div className="text-red-500 dark:text-red-400">
                        -{" "}
                        {item.removedIngredients
                          .map((ingredient) => ingredient.name)
                          .join(", ")}
                      </div>
                    )}
                    {item.specialNote && (
                      <div className="italic text-blue-500 dark:text-blue-400">
                        "{item.specialNote}"
                      </div>
                    )}
                  </div>
                )}
              </div>
              <button
                className="ml-4 p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-200"
                onClick={() => handleRemoveItem(index, item.product.name)}
                aria-label={`Remove ${item.product.name} from cart`}
              >
                <X size={20} />
              </button>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>

      <div className="border-t border-gray-300 dark:border-gray-600 pt-6 mb-8">
        <div className="flex justify-between mb-3">
          <span className="text-gray-600 dark:text-gray-400 font-medium">
            Subtotal
          </span>
          <span className="text-gray-800 dark:text-white font-medium">
            Rs. {subTotal.toFixed(2)}
          </span>
        </div>
        {taxShown && (
          <div className="flex justify-between mb-3">
            <span className="text-gray-600 dark:text-gray-400 font-medium">
              Tax
            </span>
            <span className="text-gray-800 dark:text-white font-medium">
              {tax.toFixed(2)} %
            </span>
          </div>
        )}
        {scShown && (
          <div className="flex justify-between mb-3">
            <span className="text-gray-600 dark:text-gray-400 font-medium">
              Service Charge
            </span>
            <span className="text-gray-800 dark:text-white font-medium">
              {sc.toFixed(2)} %
            </span>
          </div>
        )}
        <div className="flex justify-between text-xl font-semibold">
          <span className="text-gray-900 dark:text-white">Total</span>
          <span className="text-blue-500 dark:text-blue-400">
            Rs. {totalAmount.toFixed(2)}
          </span>
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-500 dark:text-red-400 text-sm font-medium bg-red-100 dark:bg-red-900/30 rounded-lg p-3 mb-6"
        >
          {error}
        </motion.div>
      )}

      <button
        onClick={handlePlaceOrder}
        disabled={isLoading}
        className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-lg font-semibold rounded-lg shadow-md transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isLoading ? (
          <svg
            className="animate-spin h-5 w-5 mr-2 text-white"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
        ) : null}
        Place Order
      </button>
    </motion.div>
  );
};

export default CartSummary;
