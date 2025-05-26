import api from "../api/axios";

const useCompletePrepare = () => {
  const completePrepare = async (orderId: any) => {
    try {
      return await api.post(`/orders/complete-prepare/${orderId}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "failed");
    }
  };
  return { completePrepare };
};

export default useCompletePrepare;
