import Migration from "../models/Migration.js";
import Option from "../models/Options.js";
import logger from "../utils/loggerUtil.js";

const optionsData = [
  { name: "TAX", value: 1 },
  { name: "TAX SHOW", value: 1 },
  { name: "SERVICE CHARGE", value: 1 },
  { name: "SERVICE CHARGE SHOW", value: 1 },
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
    logger.info("Migrations success..");
  } catch (error) {
    logger.error(error);
  }
};
