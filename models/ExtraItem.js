import { DataTypes } from "sequelize";
import { sequelize } from "../configs/db.js";
import Product from "./Products.js";

const ExtraItem = sequelize.define("ExtraItem", {
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
    allowNull: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  type: {
    type: DataTypes.ENUM,
    values: ["add", "remove"],
    defaultValue: "add",
  },
  price: {
    type: DataTypes.DOUBLE,
  },
  description: {
    type: DataTypes.TEXT,
  },
  deleted: {
    type: DataTypes.TINYINT,
    defaultValue: 0,
  },
  deletedProductId: {
    type: DataTypes.BIGINT,
    allowNull: true,
  },
});

Product.hasMany(ExtraItem, { foreignKey: "productId" });
ExtraItem.belongsTo(Product, { foreignKey: "productId" });

export default ExtraItem;
