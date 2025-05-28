import api from "../api/axios";
import { v4 as uuidv4 } from "uuid";

const useUpdateProduct = () => {
  const updateProduct = async (formData: any, productId: any) => {
    try {
      console.log(formData);

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
          if (img instanceof File) {
            fData.append(`img_`, img);
          } else {
            fData.append(`img_`, img.path);
          }
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

      return await api.post(`/products/${productId}`, fData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error: any) {
      console.log(error);

      throw new Error(error.response?.data?.error || "failed");
    }
  };
  return { updateProduct };
};

export default useUpdateProduct;
