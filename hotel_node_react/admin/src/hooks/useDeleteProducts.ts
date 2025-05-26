import api from "../api/axios";

const useDeleteProduct = () => {
  const deleteProduct = async (id: any) => {
    try {
      return await api.post(`/products/delete/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "failed");
    }
  };
  return { deleteProduct };
};

export default useDeleteProduct;
