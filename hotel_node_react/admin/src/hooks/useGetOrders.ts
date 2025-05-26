import api from "../api/axios";

const useGetOrders = () => {
  const getOrders = async (page: any, search: string) => {
    try {
      return await api.get(`/orders/admin`, { params: { page, search } });
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "failed");
    }
  };
  return { getOrders };
};

export default useGetOrders;
