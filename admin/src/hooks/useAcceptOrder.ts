import api from "../api/axios";

const useAcceptOrder = () => {
  const acceptOrder = async (orderId: any) => {
    try {
      return await api.post(`/orders/accept/${orderId}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "failed");
    }
  };
  return { acceptOrder };
};

export default useAcceptOrder;
