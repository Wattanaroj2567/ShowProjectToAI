const debug = require("debug")("fictionbook:user");
const { updateProfile, updateEmail, updatePassword } = require("./user-service");

exports.getProfile = async (req, res) => {
  try {
    const user = req.user;
    // Normalize profile image path for client consumption
    let profileImageUrl = null
    const img = user.profileImage || ""
    if (img && img.startsWith("profile-")) {
      profileImageUrl = `/uploads/profiles/${img}`
    } else if (!img || img.includes("default-avatar") || img.startsWith("avatars/")) {
      // No explicit image → let client show initial-letter avatar
      profileImageUrl = null
    } else if (img.startsWith("http://") || img.startsWith("https://")) {
      profileImageUrl = img
    } else if (img.startsWith("/uploads") || img.startsWith("/images")) {
      profileImageUrl = img
    } else {
      profileImageUrl = `/images/${img}`
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        email: user.email,
        profileImage: profileImageUrl,
        isGoogleUser: Boolean(user.googleId),
        hasLocalPassword: Boolean(user.password),
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (err) {
    debug("Error in getProfile:", err);
    res.status(500).json({ success: false, message: "เกิดข้อผิดพลาดในการดึงข้อมูลโปรไฟล์" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = req.user;
    const { displayName, username } = req.body;
    const updated = await updateProfile(user, {
      displayName,
      username,
      newProfileFilename: req.file ? req.file.filename : undefined,
    });
    const img2 = updated.profileImage || ""
    const profileImageUrl = img2 && img2.startsWith("profile-")
      ? `/uploads/profiles/${img2}`
      : (img2
        ? (img2.startsWith("http") || img2.startsWith("/")) ? img2 : `/images/${img2}`
        : null)
    res.json({
      success: true,
      message: "อัปเดตโปรไฟล์สำเร็จ",
      data: { username: updated.username, displayName: updated.displayName, profileImage: profileImageUrl },
    });
  } catch (err) {
    debug("Error in updateProfile:", err);
    const status = err.status || 500;
    res.status(status).json({ success: false, message: err.message || "เกิดข้อผิดพลาดในการอัปเดตโปรไฟล์" });
  }
};

exports.updateEmail = async (req, res) => {
  try {
    const user = req.user;
    const { newEmail, password } = req.body;
    await updateEmail(user, { newEmail, currentPassword: password });
    debug("เปลี่ยนอีเมลแล้ว", { userId: user.id, newEmail });
    res.json({ success: true, message: "เปลี่ยนอีเมลสำเร็จ", email: newEmail });
  } catch (err) {
    debug("Error in updateEmail:", err);
    const status = err.status || 500;
    res.status(status).json({ success: false, message: err.message || "เกิดข้อผิดพลาดในการเปลี่ยนอีเมล" });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const user = req.user;
    const { oldPassword, newPassword } = req.body;
    await updatePassword(user, { oldPassword, newPassword });
    debug("เปลี่ยนรหัสผ่านแล้ว", { userId: user.id });
    res.json({ success: true, message: "เปลี่ยนรหัสผ่านสำเร็จ" });
  } catch (err) {
    debug("Error in updatePassword:", err);
    const status = err.status || 500;
    res.status(status).json({ success: false, message: err.message || "เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน" });
  }
};
