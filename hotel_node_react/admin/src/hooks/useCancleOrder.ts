import api from "../api/axios";

const useCancleOrder = () => {
  const cancleOrder = async (orderId: any) => {
    try {
      return await api.post(`/orders/cancle/${orderId}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "failed");
    }
  };
  return { cancleOrder };
};

export default useCancleOrder;
