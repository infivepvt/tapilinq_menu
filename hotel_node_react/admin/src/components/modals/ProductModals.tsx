import { useState, useEffect } from "react";
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
  isAdded: boolean;
}

interface Variant {
  name: string;
  description: string;
  price: number;
  extraItems: ExtraItem[];
}

interface Product {
  name: string;
  description: string;
  categoryId: string;
  images: File[];
  variants: Variant[];
}

interface ImagePreviews {
  product: string | null;
  extraItems: { temp: string | null };
}

const ProductModals = ({
  isOpen,
  onClose,
  product,
  onSave,
  isEdit = false,
}: any) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const { getCategories } = useGetCategories();

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getCategories();
        if (data.categories) {
          setCategories(
            data.categories.map((c: any) => {
              if (
                !formData.categoryId ||
                formData.categoryId.toString().trim().length === 0
              ) {
                setFormData({ ...formData, categoryId: c.id });
              }
              return {
                id: c.id,
                name: c.name,
              };
            })
          );
        }
      } catch (error) {
        console.log(error);
      }
    };
    load();
  }, []);

  const initialProduct = {
    name: "",
    description: "",
    categoryId: categories[0]?.id || "",
    images: [],
    variants: [],
  };

  const [formData, setFormData] = useState<any>(product || initialProduct);
  const [variantForm, setVariantForm] = useState<Variant>({
    name: "",
    description: "",
    price: "0" as any,
    extraItems: [],
  });
  const [extraItemForm, setExtraItemForm] = useState<any>({
    name: "",
    description: "",
    price: "0" as any,
    image: null,
    isAdded: true,
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
    extraItems: { temp: null },
  });

  useEffect(() => {
    if (product) {
      let variants =
        product?.Varients?.map((v: any) => {
          return { ...v, extraItems: v.ExtraItems };
        }) || [];
      let image = product.Images?.[0]
        ? `${UPLOADS_URL}${product.Images[0].path}`
        : null;
      setFormData({ ...product, variants, images: product.Images || [] });
      setImagePreviews({ ...imagePreviews, product: image });
    }
  }, [product]);

  useEffect(() => {
    return () => {
      if (imagePreviews.product) URL.revokeObjectURL(imagePreviews.product);
      Object.values(imagePreviews.extraItems).forEach(
        (url) => url && URL.revokeObjectURL(url)
      );
    };
  }, [imagePreviews]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (imagePreviews.product) {
        URL.revokeObjectURL(imagePreviews.product);
      }
      const previewUrl = URL.createObjectURL(file);
      setFormData((prev: any) => ({
        ...prev,
        images: [file],
      }));
      setImagePreviews((prev) => ({
        ...prev,
        product: previewUrl,
      }));
      e.target.value = "";
    }
  };

  const removeProductImage = () => {
    if (imagePreviews.product) URL.revokeObjectURL(imagePreviews.product);
    setFormData((prev: any) => ({ ...prev, images: [] }));
    setImagePreviews((prev) => ({ ...prev, product: null }));
  };

  const handleVariantInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setVariantForm((prev) => ({
      ...prev,
      [name]: name === "price" ? (value ? parseFloat(value) : "") : value,
    }));
  };

  const handleExtraItemInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setExtraItemForm((prev: any) => ({
      ...prev,
      [name]: name === "price" ? (value ? parseFloat(value) : "") : value,
    }));
  };

  const handleExtraItemCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setExtraItemForm((prev: any) => ({
      ...prev,
      isAdded: e.target.checked,
    }));
  };

  const handleExtraItemImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setExtraItemForm((prev: any) => ({ ...prev, image: file }));
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
    setExtraItemForm((prev: any) => ({ ...prev, image: null }));
    setImagePreviews((prev) => ({
      ...prev,
      extraItems: { ...prev.extraItems, temp: null },
    }));
  };

  const addOrUpdateExtraItem = () => {
    if (extraItemForm.name && extraItemForm.price) {
      const newExtraItem = {
        ...extraItemForm,
        price: Number(extraItemForm.price),
      };
      setVariantForm((prev) => {
        const newExtraItems =
          editingExtraItemIndex !== null
            ? prev.extraItems.map((item, index) =>
                index === editingExtraItemIndex ? newExtraItem : item
              )
            : [...prev.extraItems, newExtraItem];
        return { ...prev, extraItems: newExtraItems };
      });
      setExtraItemForm({
        name: "",
        description: "",
        price: "" as any,
        image: null,
        isAdded: true,
      });
      setImagePreviews((prev) => ({
        ...prev,
        extraItems: { ...prev.extraItems, temp: null },
      }));
      setIsAddingExtraItem(false);
      setEditingExtraItemIndex(null);
    }
  };

  const addOrUpdateVariant = () => {
    if (variantForm.name && variantForm.price) {
      const newVariant = { ...variantForm, price: Number(variantForm.price) };
      setFormData((prev: any) => {
        const newVariants =
          editingVariantIndex !== null
            ? prev.variants.map((v: any, i: number) =>
                i === editingVariantIndex ? newVariant : v
              )
            : [...prev.variants, newVariant];
        return { ...prev, variants: newVariants };
      });
      setVariantForm({
        name: "",
        description: "",
        price: "" as any,
        extraItems: [],
      });
      setImagePreviews((prev) => ({ ...prev, extraItems: { temp: null } }));
      setIsAddingVariant(false);
      setEditingVariantIndex(null);
      setIsAddingExtraItem(false);
    }
  };

  const removeVariant = (index: number) => {
    setFormData((prev: any) => {
      const newVariants = prev.variants.filter((_: any, i: any) => i !== index);
      return { ...prev, variants: newVariants };
    });
    setExpandedVariants((prev) => {
      const newExpanded = { ...prev };
      delete newExpanded[index];
      return newExpanded;
    });
  };

  const removeExtraItem = (index: number) => {
    setVariantForm((prev) => {
      const newExtraItems = prev.extraItems.filter((_, i) => i !== index);
      return { ...prev, extraItems: newExtraItems };
    });
  };

  const editVariant = (index: number) => {
    setVariantForm(formData.variants[index]);
    setIsAddingVariant(true);
    setEditingVariantIndex(index);
  };

  const editExtraItem = (index: number) => {
    setExtraItemForm({...variantForm.extraItems[index], isAdded:variantForm.extraItems[index]?.type === "add"});
    setIsAddingExtraItem(true);
    setEditingExtraItemIndex(index);
    if (variantForm.extraItems[index].image) {
      setImagePreviews((prev) => ({
        ...prev,
        extraItems: {
          temp:
            variantForm.extraItems[index].image instanceof File
              ? URL.createObjectURL(variantForm.extraItems[index].image)
              : `${UPLOADS_URL}${variantForm.extraItems[index].image}`,
        },
      }));
    }
  };

  const toggleVariantExpand = (index: number) => {
    setExpandedVariants((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const clearData = () => {
    setFormData({});
  };

  const { addProduct } = useAddProduct();
  const { updateProduct } = useUpdateProduct();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (product) {
      try {
        await updateProduct(formData, product.id);
        toast.success("Product updated success");

        clearData();
        onClose();
      } catch (error: any) {
        toast.error(error.message);
      }
    } else {
      try {
        await addProduct(formData);
        toast.success("New product added success");

        clearData();
        onClose();
      } catch (error: any) {
        toast.error(error.message);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-xl shadow-2xl w-full max-w-[90vw] h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold tracking-tight">
              {isEdit ? "Edit Product" : "Add New Product"}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-muted rounded-full"
              onClick={onClose}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Name */}
            <div>
              <label className="text-sm font-medium text-foreground">
                Product Name *
              </label>
              <Input
                name="name"
                placeholder="Enter product name (e.g., Margherita Pizza)"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="mt-1"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium text-foreground">
                Description
              </label>
              <Input
                name="description"
                placeholder="Describe the product (e.g., Classic tomato and mozzarella pizza)"
                value={formData.description}
                onChange={handleInputChange}
                className="mt-1"
              />
            </div>

            {/* Category */}
            <div>
              <label className="text-sm font-medium text-foreground">
                Category *
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                className="mt-1 w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                {categories.map((category: Category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Product Image */}
            <div>
              <label className="text-sm font-medium text-foreground">
                Product Image
              </label>
              <div className="mt-1 flex flex-wrap gap-3">
                {imagePreviews.product ? (
                  <div className="relative">
                    <img
                      src={imagePreviews.product}
                      alt="Product preview"
                      className="h-32 w-32 object-cover rounded-md border"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1"
                      onClick={removeProductImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex h-32 w-32 items-center justify-center rounded-md border-2 border-dashed border-muted-foreground/50 bg-muted">
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
              </div>
              <label className="cursor-pointer mt-3 inline-block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="img1"
                  disabled={!!imagePreviews.product}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="mt-2"
                  onClick={() => document.getElementById("img1")?.click()}
                  disabled={!!imagePreviews.product}
                >
                  {imagePreviews.product ? "Image Uploaded" : "Upload Image"}
                </Button>
              </label>
              <p className="text-xs text-muted-foreground mt-1">
                Upload a PNG, JPG, or JPEG image (max 5MB). Only one image
                allowed.
              </p>
            </div>

            {/* Variants */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-foreground">
                  Variants
                </label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  leftIcon={<Plus className="h-4 w-4" />}
                  onClick={() => {
                    setIsAddingVariant(true);
                    setEditingVariantIndex(null);
                    setVariantForm({
                      name: "",
                      description: "",
                      price: "" as any,
                      extraItems: [],
                    });
                  }}
                >
                  Add Variant
                </Button>
              </div>

              {formData.variants?.map((variant: any, index: number) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleVariantExpand(index)}
                      >
                        {expandedVariants[index] ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </Button>
                      <span className="font-medium">{variant.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => editVariant(index)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeVariant(index)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  {expandedVariants[index] && (
                    <div className="mt-3 space-y-2 pl-8">
                      {variant.description && (
                        <p className="text-sm text-muted-foreground">
                          {variant.description}
                        </p>
                      )}
                      <p className="text-sm font-medium">LKR {variant.price}</p>
                      <p className="text-sm text-muted-foreground">
                        {variant.extraItems?.length || 0} extra item
                        {variant.extraItems?.length !== 1 ? "s" : ""}
                      </p>
                      {variant.extraItems?.map(
                        (item: any, itemIndex: number) => (
                          <div
                            key={itemIndex}
                            className="flex items-center gap-3 border-t pt-2"
                          >
                            <div>
                              <span className="text-sm">{item.name}</span>
                              {item.description && (
                                <p className="text-sm text-muted-foreground">
                                  {item.description}
                                </p>
                              )}
                              <p className="text-sm font-medium">
                                LKR {item.price}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {item.isAdded || item.type === "add"
                                  ? "Add"
                                  : "Remove"}
                              </p>
                            </div>
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
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => editExtraItem(itemIndex)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Add/Edit Variant Form */}
            {isAddingVariant && (
              <div className="border rounded-lg p-6 space-y-4 bg-muted/50">
                <h3 className="text-lg font-medium">
                  {editingVariantIndex !== null
                    ? "Edit Variant"
                    : "Add Variant"}
                </h3>
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Variant Name *
                  </label>
                  <Input
                    name="name"
                    placeholder="E.g., Small, Medium, Large"
                    value={variantForm.name}
                    onChange={handleVariantInputChange}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Description
                  </label>
                  <Input
                    name="description"
                    placeholder="E.g., 12-inch pizza with standard toppings"
                    value={variantForm.description}
                    onChange={handleVariantInputChange}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Price (LKR) *
                  </label>
                  <Input
                    name="price"
                    type="number"
                    step="0.01"
                    placeholder="E.g., 2500.00"
                    value={variantForm.price}
                    onChange={handleVariantInputChange}
                    required
                    className="mt-1"
                  />
                </div>

                {/* Extra Items */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-foreground">
                      Extra Items
                    </label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      leftIcon={<Plus className="h-4 w-4" />}
                      onClick={() => {
                        setIsAddingExtraItem(true);
                        setEditingExtraItemIndex(null);
                        setExtraItemForm({
                          name: "",
                          description: "",
                          price: "" as any,
                          image: null,
                          isAdded: true,
                        });
                      }}
                    >
                      Add Extra Item
                    </Button>
                  </div>

                  {variantForm.extraItems.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between border rounded-md p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div>
                          <span className="text-sm">{item.name}</span>
                          {item.description && (
                            <p className="text-sm text-muted-foreground">
                              {item.description}
                            </p>
                          )}
                          <p className="text-sm font-medium">
                            LKR {item.price}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {item.isAdded || item.type === "add"
                              ? "Add"
                              : "Remove"}
                          </p>
                        </div>
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
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => editExtraItem(index)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeExtraItem(index)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add/Edit Extra Item Form */}
                {isAddingExtraItem && (
                  <div className="border rounded-md p-4 space-y-3 bg-background">
                    <div>
                      <label className="text-sm font-medium text-foreground">
                        Extra Item Name *
                      </label>
                      <Input
                        name="name"
                        placeholder="E.g., Extra Cheese"
                        value={extraItemForm.name}
                        onChange={handleExtraItemInputChange}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">
                        Description
                      </label>
                      <Input
                        name="description"
                        placeholder="E.g., Additional mozzarella cheese"
                        value={extraItemForm.description}
                        onChange={handleExtraItemInputChange}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">
                        Price (LKR) *
                      </label>
                      <Input
                        name="price"
                        type="number"
                        step="0.01"
                        placeholder="E.g., 200.00"
                        value={extraItemForm.price}
                        onChange={handleExtraItemInputChange}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">
                        Action
                      </label>
                      <div className="mt-1 flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={extraItemForm.isAdded}
                          onChange={handleExtraItemCheckboxChange}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span className="text-sm text-foreground">
                          {extraItemForm.isAdded ? "Add" : "Remove"}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">
                        Extra Item Image
                      </label>
                      <div className="mt-1 flex flex-col items-start gap-3">
                        {imagePreviews.extraItems.temp ? (
                          <div className="relative">
                            <img
                              src={imagePreviews.extraItems.temp}
                              alt="Extra item preview"
                              className="h-24 w-24 object-cover rounded-md border"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1"
                              onClick={removeExtraItemImage}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex h-24 w-24 items-center justify-center rounded-md border-2 border-dashed border-muted-foreground/50 bg-muted">
                            <ImageIcon className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleExtraItemImageChange}
                            className="hidden"
                            id="img2"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            className="mt-2"
                            onClick={() =>
                              document.getElementById("img2")?.click()
                            }
                          >
                            {imagePreviews.extraItems.temp
                              ? "Change Image"
                              : "Upload Image"}
                          </Button>
                        </label>
                        <p className="text-xs text-muted-foreground">
                          Upload a PNG, JPG, or JPEG image (max 5MB)
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setIsAddingExtraItem(false);
                          setEditingExtraItemIndex(null);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={addOrUpdateExtraItem}
                        disabled={!extraItemForm.name || !extraItemForm.price}
                      >
                        {editingExtraItemIndex !== null
                          ? "Update Extra Item"
                          : "Add Extra Item"}
                      </Button>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsAddingVariant(false);
                      setEditingVariantIndex(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={addOrUpdateVariant}
                    disabled={!variantForm.name || !variantForm.price}
                  >
                    {editingVariantIndex !== null
                      ? "Update Variant"
                      : "Add Variant"}
                  </Button>
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="min-w-[120px]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="min-w-[120px]"
                disabled={!formData.name || !formData.categoryId}
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
