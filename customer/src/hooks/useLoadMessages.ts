import api from "../api/axios";

const useLoadMessages = () => {
  const loadMessages = async (username: any, tableId: any) => {
    try {
      return await api.get(`/chats?username=${username}&tableId=${tableId}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "failed");
    }
  };
  return { loadMessages };
};

export default useLoadMessages;
