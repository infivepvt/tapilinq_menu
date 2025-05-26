import api from "../api/axios";

const useDeleteTable = () => {
  const deleteTable = async (id: any) => {
    try {
      return await api.post(`/tables/delete/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "failed");
    }
  };
  return { deleteTable };
};

export default useDeleteTable;
