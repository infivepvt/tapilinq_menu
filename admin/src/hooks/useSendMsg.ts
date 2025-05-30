import api from "../api/axios";

const useSendMsg = () => {
  const sendMsg = async (messageData: any) => {
    try {
      return await api.post("/chats/send-msg-user", messageData);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Login failed");
    }
  };
  return { sendMsg };
};

export default useSendMsg;
