import { DataTypes } from "sequelize";
import { sequelize } from "../configs/db.js";
import Varient from "./Varient.js";
import Order from "./Order.js";

const OrderItem = sequelize.define("OrderItem", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  varientId: {
    type: DataTypes.BIGINT,
    references: {
      model: Varient,
      key: "id",
    },
  },
  orderId: {
    type: DataTypes.BIGINT,
    references: {
      model: Order,
      key: "id",
    },
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  extraPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  priceDeduction: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  total: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  properties: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  isNew: {
    type: DataTypes.TINYINT,
    defaultValue: 0,
  },
});

OrderItem.belongsTo(Varient, { foreignKey: "varientId" });
OrderItem.belongsTo(Order, { foreignKey: "orderId" });
Varient.hasMany(OrderItem, { foreignKey: "varientId" });
Order.hasMany(OrderItem, { foreignKey: "orderId" });

export default OrderItem;
