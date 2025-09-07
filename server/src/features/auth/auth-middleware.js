// src/features/auth/auth-middleware.js
const debug = require("debug")("fictionbook:auth");
const jwt = require("jsonwebtoken");
const { User } = require("../../model-registry");
const config = require("../../config");

const authenticate = async (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    debug("ไม่มี Token ใน Header");
    return res
      .status(401)
      .json({ success: false, message: "การเข้าถึงถูกปฏิเสธ: ไม่พบ Token" });
  }
  const token = authHeader.replace("Bearer ", "").trim();
  try {
    const decoded = jwt.verify(token, config.auth.jwtSecret);
    const user = await User.findByPk(decoded.id);
    if (!user) {
      debug("ไม่พบผู้ใช้ที่ตรงกับ Token");
      return res.status(401).json({
        success: false,
        message: "การเข้าถึงถูกปฏิเสธ: ผู้ใช้ไม่ถูกต้อง",
      });
    }
    req.user = user;
    debug("ตรวจสอบสิทธิ์สำเร็จสำหรับผู้ใช้ ID:", user.id);
    next();
  } catch (err) {
    debug("ข้อผิดพลาดในการตรวจสอบ Token:", err);
    let message = "การเข้าถึงถูกปฏิเสธ: Token ไม่ถูกต้อง";
    if (err.name === "TokenExpiredError")
      message = "การเข้าถึงถูกปฏิเสธ: Token หมดอายุ";
    return res.status(401).json({ success: false, message });
  }
};

module.exports = { authenticate };
