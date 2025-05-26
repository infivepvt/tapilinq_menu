import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, Pencil, Trash2, X, PackageOpen } from "lucide-react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { Card, CardContent, CardHeader } from "../components/ui/Card";
import { formatCurrency } from "../lib/utils";
import ProductModals from "../components/modals/ProductModals";
import useGetProducts from "../hooks/useGetProducts";
import { NO_IMAGE, UPLOADS_URL } from "../api/urls";
import useDeleteProduct from "../hooks/useDeleteProducts";
import toast from "react-hot-toast";
import useGetCategories from "../hooks/useGetCategories";

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("0");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [productList, setProductList] = useState<any>([]);

  const [categories, setCategories] = useState<any>([]);

  const { getProducts } = useGetProducts();
  const { getCategories } = useGetCategories();

  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);

  const [reloadProducts, setReloadProducts] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getCategories();
        setCategories(data.categories);
      } catch (error) {
        console.log(error);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getProducts(page, searchTerm, selectedCategory);
        setProductList(data.products);
        setPageCount(data.pageCount);
      } catch (error) {
        console.log(error);
      }
    };
    load();
  }, [searchTerm, page, selectedCategory, reloadProducts]);

  // const filteredProducts = productList.filter((product: any) => {
  //   const matchesSearch =
  //     product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     product.description.toLowerCase().includes(searchTerm.toLowerCase());
  //   const matchesCategory =
  //     selectedCategory === "all" || product.categoryId === selectedCategory;

  //   return matchesSearch && matchesCategory;
  // });

  const filteredProducts = productList;

  const handleAddProduct = (newProduct: any) => {
    setProductList((prev: any) => [
      ...prev,
      { ...newProduct, id: String(Date.now()) },
    ]);
  };

  const handleEditProduct = (updatedProduct: any) => {
    setProductList((prev: any) =>
      prev.map((p: any) =>
        p.id === updatedProduct.id ? { ...updatedProduct } : p
      )
    );
  };

  const { deleteProduct } = useDeleteProduct();

  const handleDeleteProduct = async (productId: any) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmed) return;

    try {
      await deleteProduct(productId);
      setProductList((prev: any) =>
        prev.filter((p: any) => p.id !== productId)
      );
      toast.success("Product deleted successfully.");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete product.");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">
            Manage your menu items and variants
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Link to="/categories">
            <Button variant="outline">Categories</Button>
          </Link>
          <Button
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Product
          </Button>
        </div>
      </div>

      {/* Search and filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3">
          <Input
            placeholder="Search products..."
            leftIcon={<Search className="h-4 w-4" />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            rightIcon={
              searchTerm ? (
                <button onClick={() => setSearchTerm("")}>
                  <X className="h-4 w-4" />
                </button>
              ) : undefined
            }
          />
        </div>

        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="0">All Categories</option>
            {categories.map((category: any) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product: any) => {
            const category = categories.find(
              (c: any) => c.id === product.categoryId
            );
            const lowestPrice = Math.min(
              ...product.Varients.map((v: any) => v.price)
            );
            const highestPrice = Math.max(
              ...product.Varients.map((v: any) => v.price)
            );
            const priceRange =
              lowestPrice === highestPrice
                ? formatCurrency(lowestPrice)
                : `${formatCurrency(lowestPrice)} - ${formatCurrency(
                    highestPrice
                  )}`;

            return (
              <Card
                key={product.id}
                className="overflow-hidden flex flex-col h-full"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={
                      product.Images[0]?.path
                        ? `${UPLOADS_URL}${product.Images[0]?.path}`
                        : NO_IMAGE
                    }
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                    <div>
                      <span className="inline-block px-2 py-1 bg-primary/90 text-primary-foreground rounded-md text-xs font-medium mb-2">
                        {product.Category?.name}
                      </span>
                      <h3 className="text-white font-semibold">
                        {product.name}
                      </h3>
                    </div>
                  </div>
                </div>

                <CardContent className="p-4 flex-1 flex flex-col">
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="mt-auto">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <PackageOpen className="h-4 w-4 text-muted-foreground mr-1" />
                        <span className="text-sm text-muted-foreground">
                          {product.Varients.length} variants
                        </span>
                      </div>
                      <span className="font-medium">{priceRange}</span>
                    </div>

                    <div className="flex justify-between mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<Pencil className="h-3.5 w-3.5" />}
                        onClick={() => {
                          setSelectedProduct(product);
                          setIsEditModalOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<Trash2 className="h-3.5 w-3.5" />}
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <PackageOpen className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-medium">No products found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              We couldn't find any products matching your search. Try adjusting
              your filters or add a new product.
            </p>
            <Button
              className="mt-4"
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => setIsAddModalOpen(true)}
            >
              Add New Product
            </Button>
          </CardContent>
        </Card>
      )}

      {filteredProducts.length > 0 && (
        <div className="flex justify-center mt-[100px]">
          <nav className="inline-flex space-x-2" aria-label="Pagination">
            <button
              onClick={() => {
                if (page - 1 > 0) {
                  setPage(page - 1);
                }
              }}
              className="px-3 py-1 rounded-md border border-gray-300 text-sm text-gray-700 hover:bg-gray-100"
            >
              Previous
            </button>

            {page - 3 > 0 && (
              <span className="px-3 py-1 text-sm text-gray-500">...</span>
            )}

            {page - 2 > 0 && (
              <button
                onClick={() => {
                  setPage(page - 2);
                }}
                className="px-3 py-1 rounded-md border border-gray-300 text-gray-700 text-sm hover:bg-gray-100"
              >
                {page - 2}
              </button>
            )}

            {page - 1 > 0 && (
              <button
                onClick={() => {
                  setPage(page - 1);
                }}
                className="px-3 py-1 rounded-md border border-gray-300 text-gray-700 text-sm hover:bg-gray-100"
              >
                {page - 1}
              </button>
            )}

            <button className="px-3 py-1 rounded-md border border-blue-500 bg-blue-500 text-white text-sm">
              {page}
            </button>

            {page + 1 <= pageCount && (
              <button
                onClick={() => {
                  setPage(page + 1);
                }}
                className="px-3 py-1 rounded-md border border-gray-300 text-gray-700 text-sm hover:bg-gray-100"
              >
                {page + 1}
              </button>
            )}

            {page + 2 <= pageCount && (
              <button
                onClick={() => {
                  setPage(page + 2);
                }}
                className="px-3 py-1 rounded-md border border-gray-300 text-gray-700 text-sm hover:bg-gray-100"
              >
                {page + 2}
              </button>
            )}

            {page + 3 <= pageCount && (
              <span className="px-3 py-1 text-sm text-gray-500">...</span>
            )}

            <button
              onClick={() => {
                if (page + 1 <= pageCount) {
                  setPage(page + 1);
                }
              }}
              className="px-3 py-1 rounded-md border border-gray-300 text-sm text-gray-700 hover:bg-gray-100"
            >
              Next
            </button>
          </nav>
        </div>
      )}

      <ProductModals
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setReloadProducts(!reloadProducts);
        }}
        onSave={handleAddProduct}
        // product={null}
      />

      <ProductModals
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedProduct(null);
          setReloadProducts(!reloadProducts);
        }}
        product={selectedProduct}
        onSave={handleEditProduct}
        isEdit={true}
      />
    </div>
  );
};

export default Products;
