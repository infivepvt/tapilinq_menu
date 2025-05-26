import { DataTypes } from "sequelize";
import { sequelize } from "../configs/db.js";

const Option = sequelize.define("Option", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  value: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

export default Option;
