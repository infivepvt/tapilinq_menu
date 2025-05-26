import api from "../api/axios";

const useSaveTax = () => {
  const saveTax = async (formData: any) => {
    try {
      return await api.post("/products/tax/save-tax", formData);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "failed");
    }
  };
  return { saveTax };
};

export default useSaveTax;
