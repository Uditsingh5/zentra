import jwt from "jsonwebtoken";

import { customError } from "../utils/errorProvider.js";
import User from "../models/User.js";

const verifyJwt = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader) throw customError("UNAUTHORIZED");


    const token = authHeader.split(" ")[1];
    if (!token) throw customError("UNAUTHORIZED");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded?.sub ?? decoded?.user ?? decoded?.id ?? decoded;

    const user = await User.findById(userId).select("-password");
    if (!user) throw customError("UNAUTHORIZED");

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: err.message || "Unauthorized" });
  }
};

// Export with multiple names for compatibility
export default verifyJwt;
export { verifyJwt as authMiddleware, verifyJwt as protect };
