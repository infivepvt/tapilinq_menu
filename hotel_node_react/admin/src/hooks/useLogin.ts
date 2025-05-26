import api from "../api/axios";

const useLogin = () => {
  const login = async (formData: any) => {
    try {
      return await api.post("/auth/admin-login", formData);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Login failed");
    }
  };
  return { login };
};

export default useLogin;
