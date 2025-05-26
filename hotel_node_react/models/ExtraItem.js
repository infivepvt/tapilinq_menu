import { DataTypes } from "sequelize";
import { sequelize } from "../configs/db.js";
import Varient from "./Varient.js";

const ExtraItem = sequelize.define("ExtraItem", {
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
});

Varient.hasMany(ExtraItem, { foreignKey: "varientId" });
ExtraItem.belongsTo(Varient, { foreignKey: "varientId" });

export default ExtraItem;
