import { DataTypes } from "sequelize";
import { sequelize } from "../configs/db.js";
import Product from "./Products.js";

const Image = sequelize.define("Image", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  productId: {
    type: DataTypes.BIGINT,
    references: {
      model: Product,
      key: "id",
    },
  },
  path: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Product.hasMany(Image, { foreignKey: "productId" });
Image.belongsTo(Product, { foreignKey: "productId" });

export default Image;
