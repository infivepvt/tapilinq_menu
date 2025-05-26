import api from "../api/axios";

const useGetWaiters = () => {
  const getWaiters = async () => {
    try {
      return await api.get("/waiters");
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "failed");
    }
  };
  return { getWaiters };
};

export default useGetWaiters;
