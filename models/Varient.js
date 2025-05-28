import { DataTypes } from "sequelize";
import { sequelize } from "../configs/db.js";
import Category from "./Category.js";
import Product from "./Products.js";

const Varient = sequelize.define("Varient", {
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
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  maxPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM("active", "inactive"),
    defaultValue: "active",
  },
  deleted: {
    type: DataTypes.TINYINT,
    defaultValue: 0,
  },
  deletedProductId: {
    type: DataTypes.BIGINT,
    allowNull: true,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

Product.hasMany(Varient, { foreignKey: "productId" });
Varient.belongsTo(Product, { foreignKey: "productId" });

export default Varient;
