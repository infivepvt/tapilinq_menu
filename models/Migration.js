import { DataTypes } from "sequelize";
import { sequelize } from "../configs/db.js";

const Migration = sequelize.define("Migration", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tableName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

export default Migration;
