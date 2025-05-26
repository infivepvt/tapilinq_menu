import { DataTypes } from "sequelize";
import { sequelize } from "../configs/db.js";

const Table = sequelize.define("Table", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

export default Table;
