import api from "../api/axios";

const useLoadTax = () => {
  const loadTax = async () => {
    try {
      return await api.get("/products/tax/tax");
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "failed");
    }
  };
  return { loadTax };
};

export default useLoadTax;
