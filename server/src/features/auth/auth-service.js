const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { Op } = require("sequelize");
const { User } = require("../../model-registry");
const { sequelize } = require("../../config/database");
const config = require("../../config");
const tokenService = require("../../core/services/token-service");
const emailService = require("../../core/services/email-service");
const googleService = require("../../core/services/google-service");

async function register({ username, displayName, email, password, confirmPassword }) {
  // Basic input validation at service layer
  if (!username || username.trim().length < 3) {
    const err = new Error("username ต้องยาวอย่างน้อย 3 ตัวอักษร");
    err.status = 400;
    throw err;
  }
  if (!displayName || !displayName.trim()) {
    const err = new Error("displayName จำเป็น");
    err.status = 400;
    throw err;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    const err = new Error("อีเมลไม่ถูกต้อง");
    err.status = 400;
    throw err;
  }
  if (!password || String(password).length < 8) {
    const err = new Error("รหัสผ่านต้องยาวอย่างน้อย 8 ตัวอักษร");
    err.status = 400;
    throw err;
  }
  if (confirmPassword !== password) {
    const err = new Error("รหัสยืนยันไม่ตรงกับรหัสผ่าน");
    err.status = 400;
    throw err;
  }
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    const err = new Error("Email already registered");
    err.status = 409;
    throw err;
  }
  const existingUsername = await User.findOne({ where: { username } });
  if (existingUsername) {
    const err = new Error("Username already taken");
    err.status = 409;
    throw err;
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    username,
    displayName,
    email,
    password: hashedPassword,
  });
  return user;
}

async function login({ emailOrUsername, password }) {
  const user = await User.findOne({
    where: {
      [Op.or]: [{ email: emailOrUsername }, { username: emailOrUsername }],
    },
  });
  if (!user) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  }
  const token = tokenService.signUser(user);
  return { user, token };
}

async function issueResetToken(user) {
  const resetToken = crypto.randomBytes(32).toString("hex");
  const expiry = new Date(Date.now() + 60 * 60 * 1000);
  user.resetToken = resetToken;
  user.resetTokenExpiry = expiry;
  await user.save();
  return { resetToken, expiry };
}

async function forgotPassword({ email, clientUrl }) {
  const user = await User.findOne({ where: { email } });
  if (!user) return;
  const { resetToken } = await issueResetToken(user);
  const link = `${clientUrl || config.clientUrl}/reset-password?token=${resetToken}`;
  await emailService.sendPasswordResetEmail(user, link);
}

async function resetPassword({ token, newPassword }) {
  const user = await User.findOne({
    where: { resetToken: token, resetTokenExpiry: { [Op.gt]: new Date() } },
  });
  if (!user) {
    const err = new Error("Token ไม่ถูกต้องหรือหมดอายุ");
    err.status = 400;
    throw err;
  }
  user.password = await bcrypt.hash(newPassword, 10);
  user.resetToken = null;
  user.resetTokenExpiry = null;
  await user.save();
}

async function deleteAccount(userId) {
  const transaction = await sequelize.transaction();
  try {
    const user = await User.findByPk(userId, { transaction });
    if (!user) {
      const err = new Error("ไม่พบผู้ใช้ในระบบ");
      err.status = 404;
      throw err;
    }
    // Revoke Google token if it exists
    if (user.googleRefreshToken || user.googleAccessToken) {
      await googleService.revokeGoogleToken(user.googleRefreshToken || user.googleAccessToken);
    }
    await user.destroy({ force: true, transaction });
    await transaction.commit();
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
}

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  deleteAccount,
};
