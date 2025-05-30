import api from "../api/axios";

const useAddUser = () => {
  const addUser = async (userData: any) => {
    try {
      return await api.post("/users", userData);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "failed");
    }
  };
  return { addUser };
};

export default useAddUser;
