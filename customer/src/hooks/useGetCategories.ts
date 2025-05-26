import api from "../api/axios";

const useGetCategories = () => {
  const getCategories = async () => {
    try {
      return await api.get("/categories");
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "failed");
    }
  };
  return { getCategories };
};

export default useGetCategories;
