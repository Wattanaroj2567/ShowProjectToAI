const debug = require("debug")("fictionbook:auth");
const passport = require("passport");
const {
  register,
  login,
  forgotPassword,
  resetPassword,
  deleteAccount,
} = require("./auth-service");
const config = require("../../config");

exports.register = async (req, res) => {
  try {
    const { username, displayName, email, password, confirmPassword } = req.body;
    const user = await register({ username, displayName, email, password, confirmPassword });
    debug("สมัครใหม่", user.id);
    res.status(201).json({
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      email: user.email,
    });
  } catch (err) {
    debug("error register", err);
    const status = err.status || 500;
    res.status(status).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;
    const { user, token } = await login({ emailOrUsername, password });
    debug("ล็อกอิน", user.id);
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        email: user.email,
        profileImage: user.profileImage,
      },
    });
  } catch (err) {
    debug("error login", err);
    const status = err.status || 500;
    res.status(status).json({ message: err.message });
  }
};

exports.googleCallback = (req, res, next) => {
  passport.authenticate('google', { failureRedirect: '/login', session: false }, (err, data) => {
    if (err || !data) {
      return res.redirect(`${config.clientUrl}/login?error=google-auth-failed`);
    }
    const { token, user } = data;
    const state = req.query.state ? Buffer.from(req.query.state, 'base64').toString('ascii') : '/';
    const from = state;
    const query = new URLSearchParams({
      token,
      user: JSON.stringify(user),
      from,
    }).toString();
    res.redirect(`${config.clientUrl}/login?${query}`);
  })(req, res, next);
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    await forgotPassword({ email, clientUrl: config.clientUrl });
    res.json({ message: "ถ้ามีอีเมลนี้ในระบบ จะส่งลิงก์ให้" });
  } catch (err) {
    debug("error forgotPassword", err);
    const status = err.status || 500;
    res.status(status).json({ message: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    await resetPassword({ token, newPassword });
    debug("reset password");
    res.json({ message: "เปลี่ยนรหัสผ่านสำเร็จ" });
  } catch (err) {
    debug("error resetPassword", err);
    const status = err.status || 500;
    res.status(status).json({ message: err.message });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    await deleteAccount(userId);
    debug(`ลบบัญชีผู้ใช้สำเร็จ ID: ${userId}`);
    res.json({
      success: true,
      message: "ลบบัญชีและรีวิวเรียบร้อยแล้ว",
      actions: [{ type: "CLEAR_TOKEN" }, { type: "REDIRECT", url: "/" }],
    });
  } catch (err) {
    debug("เกิดข้อผิดพลาดในการลบบัญชี:", err);
    const status = err.status || 500;
    res.status(status).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการลบบัญชี",
      error: config.server.nodeEnv === "development" ? err.message : undefined,
    });
  }
};
