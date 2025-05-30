import api from "../api/axios";

const useLoadChats = () => {
  const loadChats = async () => {
    try {
      return await api.get("/chats/get-chats");
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Login failed");
    }
  };
  return { loadChats };
};

export default useLoadChats;
