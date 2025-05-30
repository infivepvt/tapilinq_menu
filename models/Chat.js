import { DataTypes } from "sequelize";
import { sequelize } from "../configs/db.js";
import User from "./User.js";

const Chat = sequelize.define("Chat", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tableId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

export default Chat;
