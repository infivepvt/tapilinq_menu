import api from "../api/axios";

const useDeleteUser = () => {
  const deleteUser = async (id: any) => {
    try {
      return await api.post(`/users/delete/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "failed");
    }
  };
  return { deleteUser };
};

export default useDeleteUser;
