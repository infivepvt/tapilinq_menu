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

      let images = formData.images;

      if (images && images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          const img = images[i];
          let key = uuidv4();
          fData.append(`img_${key}`, img);
        }
      }

      let varients = formData.variants.map((v: any) => {
        let extras = v.extraItems.map((et: any) => {
          let img = et.image;
          let key = uuidv4();
          fData.append(key, img);

          return {
            name: et?.name,
            key,
            type: et.isAdded ? "add" : "remove",
            description: et?.description,
            price: et?.price,
            image: img instanceof File ? null : img,
          };
        });

        return {
          name: v?.name,
          description: v?.description,
          price: v?.price,
          extraItems: extras,
        };
      });

      fData.append("varients", JSON.stringify(varients));

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
