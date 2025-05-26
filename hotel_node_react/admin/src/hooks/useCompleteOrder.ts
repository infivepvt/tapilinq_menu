import api from "../api/axios";

const useCompleteOrder = () => {
  const completeOrder = async (orderId: any) => {
    try {
      return await api.post(`/orders/complete/${orderId}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "failed");
    }
  };
  return { completeOrder };
};

export default useCompleteOrder;
