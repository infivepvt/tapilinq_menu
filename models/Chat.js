import { DataTypes } from "sequelize";
import { sequelize } from "../configs/db.js";
import User from "./User.js";

const Chat = sequelize.define("Chat", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.STRING,
    references: {
      model: User,
      key: "id",
    },
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
