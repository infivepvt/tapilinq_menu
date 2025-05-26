import api from "../api/axios";

const useGetTables = () => {
  const getTables = async () => {
    try {
      return await api.get("/tables");
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "failed");
    }
  };
  return { getTables };
};

export default useGetTables;
