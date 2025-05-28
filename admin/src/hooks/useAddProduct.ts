import api from "../api/axios";
import { v4 as uuidv4 } from "uuid";

const useAddProduct = () => {
  const addProduct = async (formData: any) => {
    try {
      const fData = new FormData();
      fData.append("title", formData.name);
      fData.append("description", formData.description);
      fData.append("categoryId", formData.categoryId);
      fData.append("price", formData.price);

      let images = formData.images;

      if (images && images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          const img = images[i];
          let key = uuidv4();
          
          fData.append(`img_`, img);
        }
      }

      let varients = formData.variants.map((v: any) => {
        let img = v.image;
        let key = uuidv4();
        fData.append(key, img);

        return {
          name: v?.name,
          description: v?.description,
          price: v?.price,
          key,
        };
      });

      let extras = formData.extraItems.map((et: any) => {
        let img = et.image;
        let key = uuidv4();
        fData.append(key, img);

        return {
          name: et?.name,
          key,
          type: et.type === "add" ? "add" : "remove",
          description: et?.description,
          price: et?.price,
        };
      });

      fData.append("varients", JSON.stringify(varients));
      fData.append("extraItems", JSON.stringify(extras));

      return await api.post("/products", fData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error: any) {
      console.log(error);

      throw new Error(error.response?.data?.error || "failed");
    }
  };
  return { addProduct };
};

export default useAddProduct;
