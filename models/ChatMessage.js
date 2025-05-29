import { DataTypes } from "sequelize";
import { sequelize } from "../configs/db.js";
import Chat from "./Chat.js";

const ChatMessage = sequelize.define("ChatMessage", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  chatId: {
    type: DataTypes.BIGINT,
    references: {
      model: Chat,
      key: "id",
    },
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

Chat.hasMany(ChatMessage, { foreignKey: "chatId" });
ChatMessage.belongsTo(Chat, { foreignKey: "chatId" });

export default ChatMessage;
