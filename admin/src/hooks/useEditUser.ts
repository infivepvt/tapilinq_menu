import api from "../api/axios";

const useEditUser = () => {
  const editUser = async (userData: any, id: any) => {
    try {
      return await api.post(`/users/${id}`, userData);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "failed");
    }
  };
  return { editUser };
};

export default useEditUser;
