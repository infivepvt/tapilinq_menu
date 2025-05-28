import React, { useState, useEffect, useRef } from "react";
import { products } from "../data/mockData";
import { Product } from "../types";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Carousel from "../components/ui/Carousel";
import CategoryTabs from "../components/ui/CategoryTabs";
import SearchBar from "../components/ui/SearchBar";
import ProductCard from "../components/ui/ProductCard";
import ProductModal from "../components/ui/ProductModal";
import ChatPopup from "../components/ui/ChatPopup";
import useGetCategories from "../hooks/useGetCategories";
import useGetProducts from "../hooks/useGetProducts";
import { useLocation, useNavigate } from "react-router-dom";
import useGetTableStatus from "../hooks/useGetTableStatus";
import toast from "react-hot-toast";
import socket from "../socket";
import { BrowserQRCodeReader } from "@zxing/library";

const NewOrderPage: React.FC = () => {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [categories, setCategories] = useState<any>([]);
  const { getCategories } = useGetCategories();
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const [table] = useState(params.get("table") || null);
  const { getTableStatus } = useGetTableStatus();
  const [isTableOpen, setIsTableOpen] = useState(true);
  const [reload, setReload] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReaderRef = useRef<BrowserQRCodeReader | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        localStorage.removeItem("cart");
        if (table) {
          localStorage.setItem("table", table);
        }
        await getTableStatus(table);
        setIsTableOpen(true);
      } catch (error: any) {
        setIsTableOpen(false);
        // toast.error("Table is not open. Please scan the QR code.");
      }
    };
    load();
  }, [table]);

  useEffect(() => {
    if (isTableOpen) {
      localStorage.setItem("table", table?.toString());
      const load = async () => {
        try {
          const { data } = await getCategories();
          setCategories([
            {
              id: 0,
              name: "All",
              image:
                "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?resize=768,574",
            },
            ...data.categories,
          ]);
        } catch (error) {
          console.log(error);
        }
      };
      load();
    }
  }, [isTableOpen]);

  const { getProducts } = useGetProducts();

  useEffect(() => {
    if (isTableOpen) {
      const load = async () => {
        setFilteredProducts([]);
        try {
          const { data } = await getProducts(activeCategory, searchQuery);
          setFilteredProducts(data.products);
        } catch (error) {
          console.log(error);
        }
      };
      load();
    }
  }, [activeCategory, searchQuery, reload, isTableOpen]);

  useEffect(() => {
    if (!isTableOpen && videoRef.current) {
      codeReaderRef.current = new BrowserQRCodeReader();
      codeReaderRef.current
        .decodeFromVideoDevice(null, videoRef.current, (result, error) => {
          if (result) {
            handleScan(result.getText());
          }
          if (error) {
            console.error("QR Scan Error:", error);
          }
        })
        .catch((err) => {
          console.error("QR Scanner Initialization Error:", err);
          toast.error("Failed to initialize QR scanner.");
        });

      return () => {
        if (codeReaderRef.current) {
          codeReaderRef.current.stopContinuousDecode();
          codeReaderRef.current = null;
        }
      };
    }
  }, [isTableOpen]);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleScan = (data: string) => {
    try {
      const url = new URL(data);
      const table = url.searchParams.get("table");
      if (table) {
        window.location.replace(`${url.pathname}?table=${table}`);
        setIsTableOpen(true);
        toast.success("QR code scanned successfully!");
      } else {
        toast.error("Invalid QR code: No order ID found.");
      }
    } catch (error) {
      toast.error("Invalid QR code URL.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Header />
      <main className="flex-grow pt-16">
        {isTableOpen ? (
          <>
            <Carousel />
            <div className="container mx-auto px-4 py-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center md:text-left">
                Our Menu
              </h1>
              <SearchBar onSearch={handleSearch} />
              <CategoryTabs
                categories={categories}
                activeCategory={activeCategory}
                onCategoryChange={handleCategoryChange}
              />
              <div className="py-8">
                {filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onClick={handleProductClick}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      No items found
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Try adjusting your search or filter to find what you're
                      looking for.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="container mx-auto px-4 py-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              Scan QR Code
            </h1>
            <div className="max-w-md mx-auto">
              <video
                ref={videoRef}
                style={{ width: "100%", maxHeight: "400px" }}
                muted
                playsInline
              />
              <p className="mt-4 text-gray-500 dark:text-gray-400">
                Please scan the QR code to access the menu.
              </p>
            </div>
          </div>
        )}
      </main>
      {isTableOpen && selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={() => {
            closeModal();
            setReload(!reload);
          }}
        />
      )}
      <ChatPopup />
      <Footer />
    </div>
  );
};

export default NewOrderPage;
