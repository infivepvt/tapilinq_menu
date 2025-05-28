import { useState, useEffect, useRef } from "react";
import {
  X,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Edit2,
} from "lucide-react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import useAddProduct from "../../hooks/useAddProduct";
import toast from "react-hot-toast";
import useGetCategories from "../../hooks/useGetCategories";
import { UPLOADS_URL } from "../../api/urls";
import useUpdateProduct from "../../hooks/useUpdateProduct";
import * as LucideIcons from "lucide-react";

const ICON_LIST = Object.keys(LucideIcons).filter((icon) => icon);

// Interfaces
interface Category {
  id: string;
  name: string;
}

interface ExtraItem {
  name: string;
  description: string;
  price: number;
  image: File | null;
  type: "add" | "remove";
}

interface Variant {
  name: string;
  description: string;
  price: number;
  image: File | string | null;
  isDefault: boolean;
}

interface Product {
  name: string;
  description: string;
  categoryId: string;
  price: number;
  images: File[];
  variants: Variant[];
  extraItems: ExtraItem[];
  useVariants: boolean;
  useExtraItems: boolean;
}

interface ImagePreviews {
  product: string | null;
  variants: Record<number, string | null>;
  extraItems: { temp: string | null };
}

const ProductModals = ({
  isOpen,
  onClose,
  product,
  onSave,
  isEdit = false,
}: any) => {
  // State declarations
  const [categories, setCategories] = useState<Category[]>([]);
  const { getCategories } = useGetCategories();
  const { addProduct } = useAddProduct();
  const { updateProduct } = useUpdateProduct();
  const [iconSearch, setIconSearch] = useState<string>("");
  const [filteredIcons, setFilteredIcons] = useState([]);
  const searchRef = useRef(null);

  useEffect(() => {
    const fi = iconSearch
      ? ICON_LIST.filter((icon) =>
          icon.toLowerCase().includes(iconSearch.toLowerCase())
        ).slice(0, 20)
      : ICON_LIST.slice(0, 20);
    setFilteredIcons(fi);
    setShowDropdown(!!iconSearch && fi.length > 0);
  }, [iconSearch]);

  // Load categories
  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getCategories();
        if (data.categories) {
          setCategories(
            data.categories.map((c: any) => ({ id: c.id, name: c.name }))
          );
        }
      } catch (error) {
        console.log(error);
      }
    };
    load();
  }, []);

  const initialProduct: Product = {
    name: "",
    description: "",
    categoryId: categories[0]?.id || "",
    price: 0,
    images: [],
    variants: [],
    extraItems: [],
    useVariants: false,
    useExtraItems: false,
  };

  const [formData, setFormData] = useState<Product>(product || initialProduct);
  const [variantForm, setVariantForm] = useState<Variant>({
    name: "",
    description: "",
    price: 0,
    image: null,
    isDefault: false,
  });
  const [extraItemForm, setExtraItemForm] = useState<ExtraItem>({
    name: "",
    description: "",
    price: 0,
    image: null,
    type: "add",
  });
  const [isAddingVariant, setIsAddingVariant] = useState<boolean>(false);
  const [isAddingExtraItem, setIsAddingExtraItem] = useState<boolean>(false);
  const [editingVariantIndex, setEditingVariantIndex] = useState<number | null>(
    null
  );
  const [editingExtraItemIndex, setEditingExtraItemIndex] = useState<
    number | null
  >(null);
  const [expandedVariants, setExpandedVariants] = useState<
    Record<number, boolean>
  >({});
  const [imagePreviews, setImagePreviews] = useState<ImagePreviews>({
    product: null,
    variants: {},
    extraItems: { temp: null },
  });
  const [showDropdown, setShowDropdown] = useState(false);

  // Set default category
  useEffect(() => {
    if (!isEdit && categories.length > 0 && !formData.categoryId) {
      setFormData((prev) => ({ ...prev, categoryId: categories[0].id }));
    }
  }, [categories, isEdit, formData.categoryId]);

  // Load product data for editing
  useEffect(() => {
    if (product) {
      const variants =
        product?.Varients?.map((v: any, index: number) => ({
          ...v,
          image: v.image || null,
          isDefault: index === 0,
        })) || [];
      const image = product.Images?.[0]
        ? `${UPLOADS_URL}${product.Images[0].path}`
        : null;
      setFormData({
        ...product,
        variants,
        extraItems: product.ExtraItems || [],
        images: product.Images || [],
        useVariants: product.Varients.length > 0 || false,
        useExtraItems: product.ExtraItems.length > 0 || false,
      });
      setImagePreviews({
        product: image,
        variants: variants.reduce((acc, v, i) => {
          if (v.image) acc[i] = `${UPLOADS_URL}${v.image}`;
          return acc;
        }, {}),
        extraItems: { temp: null },
      });
    }
  }, [product]);

  // Cleanup image previews
  useEffect(() => {
    return () => {
      if (imagePreviews.product) URL.revokeObjectURL(imagePreviews.product);
      Object.values(imagePreviews.variants).forEach(
        (url) => url && URL.revokeObjectURL(url)
      );
      Object.values(imagePreviews.extraItems).forEach(
        (url) => url && URL.revokeObjectURL(url)
      );
    };
  }, [imagePreviews]);

  // Handlers
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? (value ? parseFloat(value) : 0) : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (imagePreviews.product) URL.revokeObjectURL(imagePreviews.product);
      const previewUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, images: [file] }));
      setImagePreviews((prev) => ({ ...prev, product: previewUrl }));
      e.target.value = "";
    }
  };

  const removeProductImage = () => {
    if (imagePreviews.product) URL.revokeObjectURL(imagePreviews.product);
    setFormData((prev) => ({ ...prev, images: [] }));
    setImagePreviews((prev) => ({ ...prev, product: null }));
  };

  const handleVariantInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setVariantForm((prev) => ({
      ...prev,
      [name]: name === "price" ? (value ? parseFloat(value) : 0) : value,
    }));
  };

  const handleVariantImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (imagePreviews.variants[editingVariantIndex ?? -1])
        URL.revokeObjectURL(imagePreviews.variants[editingVariantIndex ?? -1]);
      const previewUrl = URL.createObjectURL(file);
      setVariantForm((prev) => ({ ...prev, image: file }));
      setImagePreviews((prev) => ({
        ...prev,
        variants: {
          ...prev.variants,
          [editingVariantIndex ?? formData.variants.length]: previewUrl,
        },
      }));
      e.target.value = "";
    }
  };

  const removeVariantImage = () => {
    if (imagePreviews.variants[editingVariantIndex ?? -1])
      URL.revokeObjectURL(imagePreviews.variants[editingVariantIndex ?? -1]);
    setVariantForm((prev) => ({ ...prev, image: null }));
    setImagePreviews((prev) => ({
      ...prev,
      variants: {
        ...prev.variants,
        [editingVariantIndex ?? formData.variants.length]: null,
      },
    }));
  };

  const handleExtraItemInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setExtraItemForm((prev) => ({
      ...prev,
      [name]: name === "price" ? (value ? parseFloat(value) : 0) : value,
    }));
  };

  const handleExtraItemImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setExtraItemForm((prev) => ({ ...prev, image: file }));
      setImagePreviews((prev) => ({
        ...prev,
        extraItems: { ...prev.extraItems, temp: previewUrl },
      }));
      e.target.value = "";
    }
  };

  const removeExtraItemImage = () => {
    if (imagePreviews.extraItems.temp)
      URL.revokeObjectURL(imagePreviews.extraItems.temp);
    setExtraItemForm((prev) => ({ ...prev, image: null }));
    setImagePreviews((prev) => ({
      ...prev,
      extraItems: { ...prev.extraItems, temp: null },
    }));
  };

  const addOrUpdateExtraItem = () => {
    if (extraItemForm.name) {
      const newExtraItem = {
        ...extraItemForm,
        price: extraItemForm.type === "add" ? Number(extraItemForm.price) : 0,
      };
      setFormData((prev) => {
        const newExtraItems =
          editingExtraItemIndex !== null
            ? prev.extraItems.map((item, index) =>
                index === editingExtraItemIndex ? newExtraItem : item
              )
            : [...prev.extraItems, newExtraItem];
        return { ...prev, extraItems: newExtraItems };
      });
      resetExtraItemForm();
    }
  };

  const addOrUpdateVariant = () => {
    if (variantForm.name && variantForm.price) {
      const newVariant = {
        ...variantForm,
        price: Number(variantForm.price),
        isDefault: formData.variants.length === 0,
      };
      setFormData((prev) => {
        const newVariants =
          editingVariantIndex !== null
            ? prev.variants.map((v, i) =>
                i === editingVariantIndex ? newVariant : v
              )
            : [...prev.variants, newVariant];
        return { ...prev, variants: newVariants };
      });
      resetVariantForm();
    }
  };

  const removeVariant = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
    setExpandedVariants((prev) => {
      const newExpanded = { ...prev };
      delete newExpanded[index];
      return newExpanded;
    });
    setImagePreviews((prev) => {
      const newVariants = { ...prev.variants };
      if (newVariants[index]) URL.revokeObjectURL(newVariants[index]);
      delete newVariants[index];
      return { ...prev, variants: newVariants };
    });
  };

  const removeExtraItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      extraItems: prev.extraItems.filter((_, i) => i !== index),
    }));
  };

  const editVariant = (index: number) => {
    setVariantForm(formData.variants[index]);
    setIsAddingVariant(true);
    setEditingVariantIndex(index);
  };

  const editExtraItem = (index: number) => {
    setExtraItemForm(formData.extraItems[index]);
    setIsAddingExtraItem(true);
    setEditingExtraItemIndex(index);
    if (formData.extraItems[index].image) {
      setImagePreviews((prev) => ({
        ...prev,
        extraItems: {
          temp:
            formData.extraItems[index].image instanceof File
              ? URL.createObjectURL(formData.extraItems[index].image)
              : `${UPLOADS_URL}${formData.extraItems[index].image}`,
        },
      }));
    }
  };

  const toggleVariantExpand = (index: number) => {
    setExpandedVariants((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const resetVariantForm = () => {
    setVariantForm({
      name: "",
      description: "",
      price: 0,
      image: null,
      isDefault: false,
    });
    setIsAddingVariant(false);
    setEditingVariantIndex(null);
    setImagePreviews((prev) => ({
      ...prev,
      variants: {
        ...prev.variants,
        [formData.variants.length]: null,
      },
    }));
  };

  const resetExtraItemForm = () => {
    setExtraItemForm({
      name: "",
      description: "",
      price: 0,
      image: null,
      type: "add",
    });
    setIsAddingExtraItem(false);
    setEditingExtraItemIndex(null);
    setImagePreviews((prev) => ({
      ...prev,
      extraItems: { ...prev.extraItems, temp: null },
    }));
  };

  const clearData = () => {
    setFormData(initialProduct);
    setImagePreviews({
      product: null,
      variants: {},
      extraItems: { temp: null },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await updateProduct(formData, product.id);
        toast.success("Product updated successfully");
      } else {
        await addProduct(formData);
        toast.success("Product updated successfully");
      }
      clearData();
      onClose();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold dark:text-white">
              {isEdit ? "Edit Product" : "Add New Product"}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Product Details */}
            <section className="space-y-4 bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
              <h3 className="text-xl font-medium dark:text-white">
                Product Details
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="name"
                    placeholder="e.g., Margherita Pizza"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="mt-1 dark:bg-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <Input
                    name="description"
                    placeholder="e.g., Classic tomato and mozzarella pizza"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="mt-1 dark:bg-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    className="mt-1 w-full h-10 rounded-md border bg-white dark:bg-gray-600 px-3 text-sm focus:ring-2 focus:ring-blue-500 dark:text-white"
                    required
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                {!formData.useVariants && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Price (LKR) <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="price"
                      type="number"
                      step="0.01"
                      placeholder="e.g., 1500.00"
                      value={formData.price || ""}
                      onChange={handleInputChange}
                      required
                      className="mt-1 dark:bg-gray-600 dark:text-white"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Product Image
                  </label>
                  <div className="flex items-center gap-4 mt-1">
                    {imagePreviews.product ? (
                      <div className="relative">
                        <img
                          src={imagePreviews.product}
                          alt="Product preview"
                          className="h-20 w-20 object-cover rounded-md border"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={removeProductImage}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="h-20 w-20 flex items-center justify-center rounded-md border-2 border-dashed bg-gray-100 dark:bg-gray-600">
                        <ImageIcon className="h-6 w-6 text-gray-400 dark:text-gray-300" />
                      </div>
                    )}
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="product-img"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          document.getElementById("product-img")?.click()
                        }
                        className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        {imagePreviews.product
                          ? "Change Image"
                          : "Upload Image"}
                      </Button>
                    </label>
                  </div>
                </div>
              </div>
            </section>

            {/* Variants Toggle */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="useVariants"
                  checked={formData.useVariants}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      useVariants: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="useVariants"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Use Variants
                </label>
              </div>
            </section>

            {/* Extra Items Toggle */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="useExtraItems"
                  checked={formData.useExtraItems}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      useExtraItems: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="useExtraItems"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Use Extra Items
                </label>
              </div>
            </section>

            {/* Variants Section */}
            {formData.useVariants && (
              <section className="space-y-4 bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-medium dark:text-white">
                    Variants
                  </h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    (At least one required)
                  </span>
                </div>
                {formData.variants.map((variant, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-600 p-4 rounded-md shadow-sm"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleVariantExpand(index)}
                          className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
                        >
                          {expandedVariants[index] ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                        <span className="text-sm font-medium dark:text-white">
                          {variant.name}
                        </span>
                        {variant.image && (
                          <img
                            src={
                              variant.image instanceof File
                                ? URL.createObjectURL(variant.image)
                                : `${UPLOADS_URL}${variant.image}`
                            }
                            alt={variant.name}
                            className="h-6 w-6 object-cover rounded"
                          />
                        )}
                        {variant.isDefault && (
                          <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">
                            Default
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => editVariant(index)}
                          className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeVariant(index)}
                          disabled={formData.variants.length === 1}
                          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {expandedVariants[index] && (
                      <div className="mt-3 pl-6 space-y-2">
                        {variant.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {variant.description}
                          </p>
                        )}
                        <p className="text-sm font-medium dark:text-white">
                          LKR {variant.price.toFixed(2)}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  leftIcon={<Plus className="h-4 w-4" />}
                  onClick={() => setIsAddingVariant(true)}
                  className="bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                >
                  Add Variant
                </Button>
              </section>
            )}

            {/* Variant Form */}
            {formData.useVariants && isAddingVariant && (
              <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-4">
                <h3 className="text-lg font-medium dark:text-white">
                  {editingVariantIndex !== null
                    ? "Edit Variant"
                    : "New Variant"}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="name"
                      placeholder="e.g., Small"
                      value={variantForm.name}
                      onChange={handleVariantInputChange}
                      required
                      className="mt-1 dark:bg-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Price (LKR) <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="price"
                      type="number"
                      step="0.01"
                      placeholder="e.g., 1500.00"
                      value={variantForm.price || ""}
                      onChange={handleVariantInputChange}
                      required
                      className="mt-1 dark:bg-gray-600 dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <Input
                    name="description"
                    placeholder="e.g., 8-inch pizza"
                    value={variantForm.description}
                    onChange={handleVariantInputChange}
                    className="mt-1 dark:bg-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Variant Image
                  </label>
                  <div className="flex items-center gap-4 mt-1">
                    {variantForm.image ? (
                      <div className="relative">
                        <img
                          src={
                            variantForm.image instanceof File
                              ? URL.createObjectURL(variantForm.image)
                              : `${UPLOADS_URL}${variantForm.image}`
                          }
                          alt="Variant preview"
                          className="h-20 w-20 object-cover rounded-md border"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={removeVariantImage}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="h-20 w-20 flex items-center justify-center rounded-md border-2 border-dashed bg-gray-100 dark:bg-gray-600">
                        <ImageIcon className="h-6 w-6 text-gray-400 dark:text-gray-300" />
                      </div>
                    )}
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleVariantImageChange}
                        className="hidden"
                        id="variant-img"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          document.getElementById("variant-img")?.click()
                        }
                        className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        {variantForm.image ? "Change Image" : "Upload Image"}
                      </Button>
                    </label>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={resetVariantForm}
                    className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={addOrUpdateVariant}
                    disabled={!variantForm.name || !variantForm.price}
                    className="bg-green-500 text-white hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
                  >
                    {editingVariantIndex !== null ? "Update" : "Add"}
                  </Button>
                </div>
              </section>
            )}

            {/* Extra Items Section */}
            {formData.useExtraItems && (
              <section className="space-y-4 bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-medium dark:text-white">
                    Extra Items
                  </h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    (Optional add-ons or removals)
                  </span>
                </div>
                {formData.extraItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-white dark:bg-gray-600 p-4 rounded-md shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm dark:text-white">
                        {item.type === "remove"
                          ? `Remove ${item.name}`
                          : `Add ${item.name} (LKR ${item.price.toFixed(2)})`}
                      </span>
                      {item.image && (
                        <img
                          src={
                            item.image instanceof File
                              ? URL.createObjectURL(item.image)
                              : `${UPLOADS_URL}${item.image}`
                          }
                          alt={item.name}
                          className="h-8 w-8 object-cover rounded"
                        />
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => editExtraItem(index)}
                        className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExtraItem(index)}
                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  leftIcon={<Plus className="h-4 w-4" />}
                  onClick={() => setIsAddingExtraItem(true)}
                  className="bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                >
                  Add Extra Item
                </Button>
              </section>
            )}

            {/* Extra Item Form */}
            {formData.useExtraItems && isAddingExtraItem && (
              <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-4">
                <h3 className="text-lg font-medium dark:text-white">
                  {editingExtraItemIndex !== null
                    ? "Edit Extra Item"
                    : "New Extra Item"}
                </h3>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium dark:text-white">
                    Action Type
                  </h4>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="extraType"
                        value="add"
                        checked={extraItemForm.type === "add"}
                        onChange={() =>
                          setExtraItemForm({ ...extraItemForm, type: "add" })
                        }
                      />
                      <span className="text-sm dark:text-white">Add</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="extraType"
                        value="remove"
                        checked={extraItemForm.type === "remove"}
                        onChange={() =>
                          setExtraItemForm({
                            ...extraItemForm,
                            type: "remove",
                            price: 0,
                          })
                        }
                      />
                      <span className="text-sm dark:text-white">Remove</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="name"
                    placeholder="e.g., Extra Cheese"
                    value={extraItemForm.name}
                    onChange={handleExtraItemInputChange}
                    required
                    className="mt-1 dark:bg-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <Input
                    name="description"
                    placeholder="e.g., Additional cheese topping"
                    value={extraItemForm.description}
                    onChange={handleExtraItemInputChange}
                    className="mt-1 dark:bg-gray-600 dark:text-white"
                  />
                </div>
                {extraItemForm.type === "add" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Price (LKR) <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="price"
                      type="number"
                      step="0.01"
                      placeholder="e.g., 200.00"
                      value={extraItemForm.price}
                      onChange={handleExtraItemInputChange}
                      required
                      className="mt-1 dark:bg-gray-600 dark:text-white"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Image
                  </label>
                  <div className="flex items-center gap-4 mt-1">
                    {extraItemForm.image ? (
                      <div className="relative">
                        <img
                          src={
                            extraItemForm.image instanceof File
                              ? URL.createObjectURL(extraItemForm.image)
                              : `${UPLOADS_URL}${extraItemForm.image}`
                          }
                          alt="Extra item preview"
                          className="h-20 w-20 object-cover rounded-md border"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={removeExtraItemImage}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="h-20 w-20 flex items-center justify-center rounded-md border-2 border-dashed bg-gray-100 dark:bg-gray-600">
                        <ImageIcon className="h-6 w-6 text-gray-400 dark:text-gray-300" />
                      </div>
                    )}
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleExtraItemImageChange}
                        className="hidden"
                        id="extra-img"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          document.getElementById("extra-img")?.click()
                        }
                        className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        {imagePreviews.extraItems.temp
                          ? "Change Image"
                          : "Upload"}
                      </Button>
                    </label>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={resetExtraItemForm}
                    className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={addOrUpdateExtraItem}
                    disabled={!extraItemForm.name}
                    className="bg-green-500 text-white hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
                  >
                    {editingExtraItemIndex !== null ? "Update" : "Add"}
                  </Button>
                </div>
              </section>
            )}

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t dark:border-gray-600">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClose}
                className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={
                  !formData.name ||
                  !formData.categoryId ||
                  (formData.useVariants && formData.variants.length === 0) ||
                  (!formData.useVariants && !formData.price)
                }
                className="bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                {isEdit ? "Save Changes" : "Add Product"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductModals;
