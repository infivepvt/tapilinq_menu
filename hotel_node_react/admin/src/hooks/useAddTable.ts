import api from "../api/axios";

const useAddTable = () => {
  const addTable = async (formData: any, image: any) => {
    try {
      const fData = new FormData();
      fData.append("name", formData.name);
      if (image) {
        fData.append("image", image);
      }
      return await api.post("/tables", fData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "failed");
    }
  };
  return { addTable };
};

export default useAddTable;
