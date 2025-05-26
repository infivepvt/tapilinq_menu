import { DataTypes } from "sequelize";
import { sequelize } from "../configs/db.js";
import User from "./User.js";
import Table from "./Table.js";

const Order = sequelize.define("Order", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  orderId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  waiterId: {
    type: DataTypes.BIGINT,
    allowNull: true,
    references: {
      model: User,
      key: "id",
    },
  },
  cashierId: {
    type: DataTypes.BIGINT,
    allowNull: true,
    references: {
      model: User,
      key: "id",
    },
  },
  userId: {
    type: DataTypes.BIGINT,
    allowNull: true,
    references: {
      model: User,
      key: "id",
    },
  },
  customerName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  customerMobile: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tableId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Table,
      key: "id",
    },
  },
  total: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  discount: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  tax: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  status: {
    type: DataTypes.ENUM(
      "pending",
      "preparing",
      "prepared",
      "served",
      "completed",
      "cancelled"
    ),
    defaultValue: "pending",
  },
});

Order.belongsTo(User, { foreignKey: "waiterId", as: "waiter" });
User.hasMany(Order, { foreignKey: "waiterId" });

Order.belongsTo(User, { foreignKey: "cashierId", as: "cashier" });
User.hasMany(Order, { foreignKey: "cashierId" });

Order.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasMany(Order, { foreignKey: "userId" });

Order.belongsTo(Table, { foreignKey: "tableId" });
Table.hasMany(Order, { foreignKey: "tableId" });

export default Order;
