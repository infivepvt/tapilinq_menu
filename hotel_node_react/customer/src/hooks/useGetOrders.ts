import api from "../api/axios";

const useGetOrders = () => {
  const getOrders = async (orders: any) => {
    try {
      return await api.post("/orders/customer", { orders });
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "failed");
    }
  };
  return { getOrders };
};

export default useGetOrders;
