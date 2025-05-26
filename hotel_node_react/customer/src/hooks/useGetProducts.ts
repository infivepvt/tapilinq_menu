import api from "../api/axios";

const useGetProducts = () => {
  const getProducts = async (category: any, search: any) => {
    try {
      return await api.get("/products/customer/products", {
        params: { category, search },
      });
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "failed");
    }
  };
  return { getProducts };
};

export default useGetProducts;
