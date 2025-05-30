import api from "../api/axios";

const useSendMessage = () => {
  const sendMessage = async (messageData: any) => {
    try {
      return await api.post("/chats/send-msg", messageData);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "failed");
    }
  };
  return { sendMessage };
};

export default useSendMessage;
