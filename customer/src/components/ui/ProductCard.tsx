import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Product } from "../../types";
import { UPLOADS_URL } from "../../api/urls";
import { useCart } from "../../context/CartContext";

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

const ProductCard = ({ product, onClick }: any) => {
  const [addedProduct, setAddedProduct] = useState(null);

  const { subTotal } = useCart();

  useEffect(() => {
    let cart = localStorage.getItem("cart") || null;
    if (cart) {
      cart = JSON.parse(cart);
      let p = cart?.find((c: any) => c.product.id === product.id);
      setAddedProduct(p);
    }
  }, [subTotal]);

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-row cursor-pointer border border-gray-200 dark:border-gray-700 w-full max-w-2xl mx-auto"
      onClick={() => onClick(product)}
    >
      <div className="relative w-1/3 min-w-[120px] h-40 sm:h-48">
        <img
          src={`${UPLOADS_URL}${product.Images[0]?.path}`}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      <div className="p-3 sm:p-4 flex flex-col justify-between flex-grow w-2/3">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate">
              {product.name}
            </h3>
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full">
              {product.Category?.name}
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
          <p className="text-green-600 text-[20px] mb-3 line-clamp-2 font-bold">
            Rs.{product.Varients[0].price}
          </p>
          {product.status === "inactive" && (
            <p className="text-red-600 text-xs sm:text-sm mb-3 line-clamp-2">
              This item is currently unavailable
            </p>
          )}
          {addedProduct && (
            <p className="text-green-600 dark:text-green-300 text-xs sm:text-sm mb-3 line-clamp-2">
              {addedProduct.quantity} Item added to order
            </p>
          )}
        </div>

        <div className="flex justify-between items-center mt-auto">
          <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {product.Varients?.map((i: any) => i.name)
              .slice(0, 3)
              .join(", ")}
            {product.Varients?.length > 3 && "..."}
          </div>
          <button
            className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white p-2 rounded-full shadow-sm transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onClick(product);
            }}
            aria-label="Add to order"
          >
            <Plus size={16} sm:size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
