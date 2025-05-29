import Migration from "../models/Migration.js";
import Option from "../models/Options.js";
import User from "../models/User.js";
import logger from "../utils/loggerUtil.js";

const optionsData = [
  { name: "TAX", value: 1 },
  { name: "TAX SHOW", value: 1 },
  { name: "SERVICE CHARGE", value: 1 },
  { name: "SERVICE CHARGE SHOW", value: 1 },
];

const defaultUser = [
  {
    name: "Admin",
    email: "admin@gmail.com",
    password: "$2b$10$zdBeDkUF4sLL.eCL1pHYe.ObFfOLhfcuC8T6vBMvOkY4a0cLVYQVm",
    role: "admin",
  },
];

export const addDefaultDBData = async () => {
  try {
    const tbl1 = await Migration.findOne({
      where: { tableName: Option.tableName },
    });
    if (!tbl1) {
      for (let i = 0; i < optionsData.length; i++) {
        let opt = optionsData[i];
        await Option.create(opt);
      }
      await Migration.create({
        tableName: Option.tableName,
        name: "Options initial migrations.",
      });
    }

    const tbl2 = await Migration.findOne({
      where: { tableName: User.tableName },
    });
    if (!tbl2) {
      for (let i = 0; i < defaultUser.length; i++) {
        let opt = defaultUser[i];
        await User.create(opt);
      }
      await Migration.create({
        tableName: User.tableName,
        name: "User initial migrations.",
      });
    }

    logger.info("Migrations success..");
  } catch (error) {
    logger.error(error);
  }
};
