import api from "../api/axios";

const useGetMessages = () => {
  const getMessages = async (username: any, tableId: any) => {
    try {
      return await api.get(
        `/chats/get-messages?username=${username}&tableId=${tableId}`
      );
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Login failed");
    }
  };
  return { getMessages };
};

export default useGetMessages;
