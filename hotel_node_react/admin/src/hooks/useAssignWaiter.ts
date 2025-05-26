import api from "../api/axios";

const useAssignWaiter = () => {
  const assignWaiter = async (orderId: any, waiterId: any) => {
    try {
      return await api.post("/orders/waiter-assign", { orderId, waiterId });
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "failed");
    }
  };
  return { assignWaiter };
};

export default useAssignWaiter;
