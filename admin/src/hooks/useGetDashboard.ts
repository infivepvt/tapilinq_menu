import api from "../api/axios";

const useGetDashboard = () => {
  const getDashboard = async () => {
    try {
      return await api.get("/dashboard");
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "failed");
    }
  };
  return { getDashboard };
};

export default useGetDashboard;
