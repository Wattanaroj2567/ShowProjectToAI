const bcrypt = require("bcryptjs");
const { User } = require("../../model-registry");
const fileService = require("../../core/services/file-service");

async function updateProfile(
  user,
  { displayName, username, newProfileFilename }
) {
  if (username && !user.googleId && username !== user.username) {
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      const err = new Error("ชื่อผู้ใช้นี้มีอยู่แล้วในระบบ");
      err.status = 409;
      throw err;
    }
  }
  const updates = {};
  if (displayName) updates.displayName = displayName;
  if (username && !user.googleId) updates.username = username;
  if (newProfileFilename) {
    await fileService.deleteProfileImageIfExists(user.profileImage);
    updates.profileImage = newProfileFilename;
  }
  await user.update(updates);
  // Best-effort cleanup: remove other profile images for this user (prefix match)
  if (updates.profileImage) {
    await fileService.cleanupUserProfileImages(user.id, updates.profileImage);
  }
  return user;
}

async function updateEmail(user, { newEmail, currentPassword }) {
  if (!newEmail || !currentPassword) {
    const err = new Error("ต้องใส่อีเมลใหม่และรหัสผ่านปัจจุบัน");
    err.status = 400;
    throw err;
  }
  const match = await bcrypt.compare(currentPassword, user.password);
  if (!match) {
    const err = new Error("รหัสผ่านไม่ถูกต้อง");
    err.status = 401;
    throw err;
  }
  const exists = await User.findOne({ where: { email: newEmail } });
  if (exists) {
    const err = new Error("อีเมลนี้มีอยู่ในระบบแล้ว");
    err.status = 409;
    throw err;
  }
  await user.update({ email: newEmail });
  return user;
}

async function updatePassword(user, { oldPassword, newPassword }) {
  if (!oldPassword || !newPassword) {
    const err = new Error("ต้องใส่รหัสผ่านเดิมและรหัสผ่านใหม่");
    err.status = 400;
    throw err;
  }
  const match = await bcrypt.compare(oldPassword, user.password);
  if (!match) {
    const err = new Error("รหัสผ่านเดิมไม่ถูกต้อง");
    err.status = 401;
    throw err;
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await user.update({ password: hashedPassword });
  return user;
}

module.exports = { updateProfile, updateEmail, updatePassword };
