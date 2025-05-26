import React, { useEffect, useState } from "react";
import { X, ShoppingBag } from "lucide-react";
import { useCart } from "../../context/CartContext";

interface CartSummaryProps {
  onPlaceOrder: (tableNumber: number, customerName: string) => void;
}

const CartSummary: React.FC<CartSummaryProps> = ({ onPlaceOrder }) => {
  const { cart, removeFromCart, totalAmount, subTotal } = useCart();
  const [tableNumber, setTableNumber] = useState<number>(1);
  const [customerName, setCustomerName] = useState("");
  const [error, setError] = useState<string>("");

  const [taxShown, setTaxShown] = useState(true);
  const [tax, setTax] = useState(0);

  useEffect(() => {
    const taxData = localStorage.getItem("tax") || "0";
    const showTaxData = localStorage.getItem("showTax") || "true";

    setTax(parseFloat(taxData));
    setTaxShown(JSON.parse(showTaxData) === true);
  }, []);

  const handlePlaceOrder = () => {
    setError("");
    onPlaceOrder(tableNumber, customerName);
  };

  if (cart.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 max-w-2xl mx-auto">
        <div className="flex flex-col items-center justify-center py-12">
          <ShoppingBag
            size={64}
            className="text-gray-300 dark:text-gray-600 mb-6"
          />
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
            Your Cart is Empty
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
            Explore our menu and add some delicious items to start your order!
          </p>
          <a
            href="/"
            className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-all duration-300"
          >
            Browse Menu
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Order Summary
      </h2>

      <div className="space-y-6 mb-8">
        {cart.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg px-2"
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
                    <div className="text-green-600 dark:text-green-400">
                      +{" "}
                      {item.addedIngredients
                        .map((ingredient) => ingredient.name)
                        .join(", ")}
                    </div>
                  )}
                  {item.removedIngredients.length > 0 && (
                    <div className="text-red-600 dark:text-red-400">
                      -{" "}
                      {item.removedIngredients
                        .map((ingredient) => ingredient.name)
                        .join(", ")}
                    </div>
                  )}
                  {item.specialNote && (
                    <div className="italic">"{item.specialNote}"</div>
                  )}
                </div>
              )}
            </div>
            <button
              className="ml-4 p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-200"
              onClick={() => removeFromCart(index)}
              aria-label={`Remove ${item.product.name} from cart`}
            >
              <X size={20} />
            </button>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mb-8">
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
        <div className="flex justify-between text-xl font-semibold">
          <span className="text-gray-900 dark:text-white">Total</span>
          <span className="text-blue-600 dark:text-blue-400">
            Rs. {totalAmount.toFixed(2)}
          </span>
        </div>
      </div>

      {error && (
        <div className="mb-6 text-red-600 dark:text-red-400 text-sm font-medium">
          {error}
        </div>
      )}

      <button
        onClick={handlePlaceOrder}
        className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-lg font-semibold rounded-lg shadow-md transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Place Order
      </button>
    </div>
  );
};

export default CartSummary;
