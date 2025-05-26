import logger from "../utils/loggerUtil.js";

const errorHandler = (err, req, res, next) => {
  console.log(err);
  
  logger.error(`${err.statusCode || 500} - ${err.message}`);

  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || "Internal Server Error",
  });
};

export default errorHandler;
