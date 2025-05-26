import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  ArrowLeft,
  UploadCloud,
} from "lucide-react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { Card, CardContent } from "../components/ui/Card";
import useAddCategory from "../hooks/useAddCategory";
import toast from "react-hot-toast";
import { NO_IMAGE, UPLOADS_URL } from "../api/urls";
import useGetCategories from "../hooks/useGetCategories";
import useUpdateCategory from "../hooks/useUpdateCategory";
import useDeleteCategory from "../hooks/useDeleteCCategory";

const Categories = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);

  const { addCategory } = useAddCategory();
  const { updateCategory } = useUpdateCategory();
  const { getCategories } = useGetCategories();
  const { deleteCategory } = useDeleteCategory();

  const [reload, setReload] = useState(false);

  const filteredCategories = categories.filter(
    (c) => c.name && c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
  }, [reload]);

  // Form state
  const [image, setImage] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
  });

  const handleAddCategory = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      description: "",
      image: "",
    });
    setShowModal(true);
  };

  const handleEditCategory = (category: (typeof categories)[0]) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      image: category.image,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      try {
        await updateCategory(formData, image, editingCategory.id);
        toast.success("Category updated successfully");
        setShowModal(false);
        setReload(!reload);
      } catch (error: any) {
        toast.error(error.message || "Failed to update category");
      }
    } else {
      try {
        await addCategory(formData, image);
        toast.success("Category added successfully");
        setShowModal(false);
        setReload(!reload);
      } catch (error: any) {
        toast.error(error.message || "Failed to add category");
      }
    }
  };

  const handleDelete = async (id: any) => {
    try {
      await deleteCategory(id);
      toast.success("Category deleted successfully");
      setReload(!reload);
    } catch (error: any) {
      toast.error(error.message || "Failed to delete category");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Link to="/products">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
            <p className="text-muted-foreground">Manage your menu categories</p>
          </div>
        </div>

        <Button
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={handleAddCategory}
        >
          Add Category
        </Button>
      </div>

      {/* Search box */}
      <div className="max-w-md">
        <Input
          placeholder="Search categories..."
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

      {/* Categories grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredCategories.map((category) => (
          <Card key={category.id} className="overflow-hidden">
            <div className="aspect-video relative overflow-hidden">
              <img
                src={
                  category.image ? `${UPLOADS_URL}${category.image}` : NO_IMAGE
                }
                alt={category.name}
                className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute inset-0 bg-black/40"></div>
                <h3 className="relative z-10 text-xl font-bold text-white">
                  {category.name}
                </h3>
              </div>
            </div>

            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-4">
                {category.description}
              </p>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Pencil className="h-3.5 w-3.5" />}
                  onClick={() => handleEditCategory(category)}
                >
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(category.id)}
                  variant="outline"
                  size="sm"
                  leftIcon={<Trash2 className="h-3.5 w-3.5" />}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Category Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div
            className="fixed inset-0"
            onClick={() => setShowModal(false)}
          ></div>
          <div className="relative rounded-lg bg-card shadow-lg w-full max-w-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-bold mb-4">
                {editingCategory ? "Edit Category" : "Add New Category"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Category Name"
                  placeholder="Enter category name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />

                <Input
                  label="Image URL"
                  type="file"
                  onChange={(e) =>
                    setImage(e.target.files ? e.target.files[0] : null)
                  }
                  leftIcon={<UploadCloud className="h-4 w-4" />}
                  accept="image/*"
                />

                {/* {formData.image && (
                  <div className="mt-2 rounded-md overflow-hidden border border-border">
                    <img
                      src={formData.image}
                      alt="Category preview"
                      className="w-full h-40 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://via.placeholder.com/400x200?text=Invalid+Image+URL";
                      }}
                    />
                  </div>
                )} */}

                <div className="flex justify-end space-x-2 pt-2">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingCategory ? "Update Category" : "Add Category"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
