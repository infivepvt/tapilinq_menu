import api from "../api/axios";

const usePlaceOrder = () => {
  const placeOrder = async (order: any) => {
    try {
      return await api.post("/orders", order);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "failed");
    }
  };
  return { placeOrder };
};

export default usePlaceOrder;
