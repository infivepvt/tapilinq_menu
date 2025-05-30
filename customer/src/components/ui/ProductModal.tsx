import React, { useEffect, useState } from "react";
import { X, Minus, Plus } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { UPLOADS_URL } from "../../api/urls";
import useLoadTax from "../../hooks/useLoadTax";

// Define TypeScript interfaces for type safety
interface ExtraItem {
  id: number;
  variantId: number;
  name: string;
  image?: string;
  type: "add" | "remove";
  price: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface Variant {
  id: number;
  name: string;
  size: string;
  price: number;
  description?: string;
  ExtraItems: ExtraItem[];
}

interface Product {
  id: number;
  categoryId: number;
  name: string;
  description: string;
  status: string;
  Images: { path: string }[];
  Varients: Variant[];
  Category: { name: string };
}

interface CartItem {
  product: Product;
  variant: Variant;
  quantity: number;
  addedIngredients: string[];
  removedIngredients: string[];
  specialNote: string;
}

interface ProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

const ProductModal = ({ product, isOpen, onClose }: ProductModalProps) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [showQuantityConfirmation, setShowQuantityConfirmation] =
    useState(false);
  const [selectedVariant, setSelectedVariant] = useState<Variant>(
    product.Varients[0] || {}
  );
  const [addedIngredients, setAddedIngredients] = useState<string[]>([]);
  const [removedIngredients, setRemovedIngredients] = useState<string[]>([]);
  const [specialNote, setSpecialNote] = useState("");
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

  if (!isOpen) return null;

  const handleAddIngredient = (id: any, ingredient: string, price: any) => {
    let ing = addedIngredients.find((e) => e.id === id);
    if (ing) {
      setAddedIngredients([...addedIngredients.filter((i) => i.id !== id)]);
    } else {
      setAddedIngredients([
        ...addedIngredients,
        { id, name: ingredient, price },
      ]);
    }
  };

  const handleRemoveIngredient = (id: any, ingredient: string, price: any) => {
    let ing = removedIngredients.find((e) => e.id === id);
    if (ing) {
      setRemovedIngredients([...removedIngredients.filter((i) => i.id !== id)]);
    } else {
      setRemovedIngredients([
        ...removedIngredients,
        { id, name: ingredient, price },
      ]);
    }
  };

  const handleVariantChange = (variant: Variant) => {
    setSelectedVariant(variant);
    setAddedIngredients([]);
    setRemovedIngredients([]);
  };

  const handleQuantityChange = (value: number) => {
    const newQuantity = Math.max(1, value);
    setQuantity(newQuantity);
    if (newQuantity.toString().length > 2) {
      setShowQuantityConfirmation(true);
    } else {
      setShowQuantityConfirmation(false);
    }
  };

  const confirmQuantity = () => {
    setShowQuantityConfirmation(false); // Just hide confirmation without changing quantity
  };

  const cancelQuantity = () => {
    setQuantity(0); // Set quantity to 0 on cancel
    setShowQuantityConfirmation(false);
  };

  const handleAddToCart = () => {
    if (quantity.toString().length > 2) {
      setShowQuantityConfirmation(true);
      return;
    }

    const cartItem: CartItem = {
      product,
      variant: selectedVariant,
      quantity,
      addedIngredients,
      removedIngredients,
      specialNote,
    };

    addToCart(cartItem);
    onClose();

    // Reset state
    setQuantity(1);
    setSelectedVariant(product.Varients[0] || {});
    setAddedIngredients([]);
    setRemovedIngredients([]);
    setSpecialNote("");
  };

  const calculateTotalPrice = () => {
    const extraIngredientsTotal = addedIngredients.reduce(
      (total, ingredient) => {
        const extraIng = product.ExtraItems?.find(
          (ei) => ei.id === ingredient.id
        );
        return total + (extraIng?.price || 0);
      },
      0
    );

    return (parseFloat(selectedVariant.price) + extraIngredientsTotal) * quantity;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <img
            src={`${UPLOADS_URL}${product.Images[0]?.path}`}
            alt={product.name}
            className="w-full h-64 object-cover"
          />
          <button
            className="absolute top-4 right-4 p-2 bg-white/80 dark:bg-gray-900/80 rounded-full text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 transition-colors"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
            <h2 className="text-white text-2xl font-bold">{product.name}</h2>
          </div>
        </div>

        <div className="p-6">
          <div className="flex justify-between mb-4">
            <span className="text-lg text-gray-600 dark:text-gray-300">
              Rs.{selectedVariant.price}
            </span>
            <span className="text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full">
              {product.Category.name}
            </span>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
              Select Variant
            </h3>
            <div className="flex flex-wrap gap-2">
              {product.Varients.map((variant: Variant, index: number) => (
                <button
                  key={index}
                  className={`px-4 py-2 rounded-full ${
                    selectedVariant.id === variant.id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                  } hover:bg-blue-500 hover:text-white transition-colors`}
                  onClick={() => handleVariantChange(variant)}
                >
                  {variant.name}
                </button>
              ))}
            </div>
          </div>

          <p className="text-gray-700 dark:text-gray-300 mb-6">
            {selectedVariant.description || product.description}
          </p>

          {product.ExtraItems?.filter((i) => i.type === "remove").length >
            0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                Ingredients
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.ExtraItems.filter((i) => i.type === "remove").map(
                  (ingredient: ExtraItem, index: number) => (
                    <div key={index} className="flex items-center">
                      <button
                        className={`flex items-center space-x-2 px-3 py-1.5 rounded-full ${
                          removedIngredients.find(
                            (i) => i.name === ingredient.name
                          )
                            ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 line-through"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                        }`}
                        onClick={() =>
                          handleRemoveIngredient(
                            ingredient.id,
                            ingredient.name,
                            ingredient.price
                          )
                        }
                      >
                        {ingredient.image && (
                          <img
                            src={`${UPLOADS_URL}${ingredient.image}`}
                            alt={ingredient.name}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                        )}
                        <span>{ingredient.name}</span>
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {product.ExtraItems?.filter((i) => i.type === "add").length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                Extra Ingredients
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.ExtraItems.filter((i) => i.type === "add").map(
                  (ingredient: ExtraItem, index: number) => (
                    <button
                      key={index}
                      className={`flex items-center space-x-2 px-3 py-1.5 rounded-full ${
                        addedIngredients.find((i) => i.name === ingredient.name)
                          ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                      }`}
                      onClick={() =>
                        handleAddIngredient(
                          ingredient.id,
                          ingredient.name,
                          ingredient.price
                        )
                      }
                    >
                      {ingredient.image && (
                        <img
                          src={`${UPLOADS_URL}${ingredient.image}`}
                          alt={ingredient.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      )}
                      <span>{ingredient.name}</span>
                      <span className="ml-1 text-sm opacity-75">
                        +${ingredient.price.toFixed(2)}
                      </span>
                    </button>
                  )
                )}
              </div>
            </div>
          )}

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
              Special Instructions
            </h3>
            <textarea
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Any special requests for this item..."
              value={specialNote}
              onChange={(e) => setSpecialNote(e.target.value)}
            />
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-4">
            <div className="flex items-center justify-center space-x-4">
              <button
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                onClick={() => handleQuantityChange(quantity - 1)}
                aria-label="Decrease quantity"
              >
                <Minus size={16} />
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) =>
                  handleQuantityChange(parseInt(e.target.value) || 1)
                }
                className="w-20 text-center border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="Quantity"
              />
              <button
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                onClick={() => handleQuantityChange(quantity + 1)}
                aria-label="Increase quantity"
              >
                <Plus size={16} />
              </button>
            </div>

            {showQuantityConfirmation && (
              <div className="bg-yellow-100 dark:bg-yellow-900/30 p-4 rounded-lg text-center">
                <p className="text-yellow-800 dark:text-yellow-200 mb-2">
                  Are you sure you want to order {quantity} items?
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    onClick={cancelQuantity}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    onClick={confirmQuantity}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            )}

            {/* <div>
              {taxShown && (
                <p>
                  Tax: <span>{tax}%</span>
                </p>
              )}
              {scShown && (
                <p>
                  Service Charge: <span>{sc}%</span>
                </p>
              )}
            </div> */}

            <button
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors mt-[50px]"
              onClick={handleAddToCart}
            >
              Add to Order · Rs. {calculateTotalPrice().toFixed(2)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
