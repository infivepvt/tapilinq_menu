import api from "../api/axios";

const useDeleteCategory = () => {
  const deleteCategory = async (id: any) => {
    try {
      return await api.post(`/categories/delete/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "failed");
    }
  };
  return { deleteCategory };
};

export default useDeleteCategory;
