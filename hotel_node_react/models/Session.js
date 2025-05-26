import { DataTypes } from "sequelize";
import { sequelize } from "../configs/db.js";
import User from "./User.js";

const Session = sequelize.define("Session", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  sessionId: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  userId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

User.hasMany(Session, { foreignKey: "userId" });
Session.belongsTo(User, { foreignKey: "userId" });

export default Session;
