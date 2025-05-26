import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem, Product } from "../types";

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (index: number) => void;
  updateCartItem: (index: number, item: CartItem) => void;
  clearCart: () => void;
  totalAmount: number;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [subTotal, setSubTotal] = useState<number>(0);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));

    let totalAmount = cart.reduce((sum, item) => {
      const basePrice = item.variant.price;
      const added = item.addedIngredients.reduce(
        (acc, ing) => acc + ing.price,
        0
      );
      const removed = item.removedIngredients.reduce(
        (acc, ing) => acc + ing.price,
        0
      );

      const itemTotal =
        (parseFloat(basePrice) + added - removed) * item.quantity;

      return sum + itemTotal;
    }, 0);

    const taxData = localStorage.getItem("tax") || "0";
    let tax = parseFloat(taxData);

    let taxAmount = (totalAmount / 100) * tax;

    setSubTotal(Number(totalAmount.toFixed(2)));
    setTotalAmount(Number((totalAmount + taxAmount).toFixed(2)));

    const items = cart.reduce((sum, item) => sum + item.quantity, 0);
    setTotalItems(items);
  }, [cart]);

  const addToCart = (newItem: CartItem) => {
    setCart((prevCart) => [...prevCart, newItem]);
  };

  const removeFromCart = (index: number) => {
    setCart((prevCart) => prevCart.filter((_, i) => i !== index));
  };

  const updateCartItem = (index: number, updatedItem: CartItem) => {
    setCart((prevCart) =>
      prevCart.map((item, i) => (i === index ? updatedItem : item))
    );
  };

  const clearCart = (orderId: any) => {
    let orders = localStorage.getItem("orders");
    if (orders) {
      orders = JSON.parse(orders);
      let newOrders = [...orders, orderId];
      localStorage.setItem("orders", JSON.stringify(newOrders));
    } else {
      localStorage.setItem("orders", JSON.stringify([orderId]));
    }
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateCartItem,
        clearCart,
        totalAmount,
        totalItems,
        subTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
