import api from "../api/axios";

const useGetProducts = () => {
  const getProducts = async (page: any, search: string, category: any) => {
    try {
      return await api.get(`/products`, { params: { page, search, category } });
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "failed");
    }
  };
  return { getProducts };
};

export default useGetProducts;
