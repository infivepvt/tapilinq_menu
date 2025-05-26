import api from "../api/axios";

const useUpdateCategory = () => {
  const updateCategory = async (formData: any, image: any, id: any) => {
    try {
      const fData = new FormData();
      fData.append("name", formData.name);
      if (image) {
        fData.append("image", image);
      }
      return await api.post(`/categories/${id}`, fData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "failed");
    }
  };
  return { updateCategory };
};

export default useUpdateCategory;
