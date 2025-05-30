import api from "../api/axios";

const useGetUsers = () => {
  const getUsers = async () => {
    try {
      return await api.get("/users");
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "failed");
    }
  };
  return { getUsers };
};

export default useGetUsers;
