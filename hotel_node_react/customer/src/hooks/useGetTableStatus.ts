import api from "../api/axios";

const useGetTableStatus = () => {
  const getTableStatus = async (id: any) => {
    try {
      return await api.get(`/tables/status/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "failed");
    }
  };
  return { getTableStatus };
};

export default useGetTableStatus;
