import api from "../api/axios";

const useServeOrder = () => {
  const serveOrder = async (orderId: any) => {
    try {
      return await api.post(`/orders/serve/${orderId}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "failed");
    }
  };
  return { serveOrder };
};

export default useServeOrder;
