import { DataTypes } from "sequelize";
import { sequelize } from "../configs/db.js";
import User from "./User.js";

const Chat = sequelize.define("Chat", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.BIGINT,
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

User.hasMany(Chat, { foreignKey: "userId" });
Chat.belongsTo(User, { foreignKey: "userId" });

export default Chat;
