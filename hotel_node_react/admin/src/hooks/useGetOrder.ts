import api from "../api/axios";

const useGetOrder = () => {
  const getOrder = async (orderId: any) => {
    try {
      return await api.get(`/orders/admin/${orderId}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "failed");
    }
  };
  return { getOrder };
};

export default useGetOrder;
