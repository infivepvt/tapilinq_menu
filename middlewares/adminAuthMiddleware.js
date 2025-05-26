import User from "../models/User.js";
import { verifyToken } from "../utils/jwtUtil.js";

const role = "admin";

const adminAuth = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const user = await User.findByPk(decoded.userId);
    if (!user || user.role !== role) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    req.user = { ...user, sessionId: decoded.sessionId };
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
};

export default adminAuth;
