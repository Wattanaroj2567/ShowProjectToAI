const fs = require("fs");
const path = require("path");
const debug = require("debug")("fictionbook:service:file");

async function deleteProfileImageIfExists(imagePath) {
  try {
    if (!imagePath || imagePath.includes("default-avatar.png")) return;
    const uploadsDir = path.join(__dirname, "../../../uploads/profiles");
    const filename = path.basename(imagePath);
    if (!filename.startsWith("profile-")) return;
    const fullPath = path.join(uploadsDir, filename);
    try {
      await fs.promises.unlink(fullPath);
      debug(`Deleted old profile image: ${filename}`);
    } catch (e) {
      if (e && e.code !== "ENOENT") {
        debug("Error deleting old image:", e);
      }
    }
  } catch (err) {
    debug("Error deleting old image:", err);
  }
}

async function cleanupUserProfileImages(userId, keepFilename) {
  try {
    const uploadsDir = path.join(__dirname, "../../../uploads/profiles");
    const keep = path.basename(keepFilename || "");
    const prefix = `profile-${userId}-`;
    const files = await fs.promises.readdir(uploadsDir);
    await Promise.all(
      files
        .filter((f) => f.startsWith(prefix) && f !== keep)
        .map(async (f) => {
          try {
            await fs.promises.unlink(path.join(uploadsDir, f));
            debug(`Cleaned stray profile image for user ${userId}: ${f}`);
          } catch (e) {
            if (e && e.code !== "ENOENT") {
              debug("Error cleaning old image:", e);
            }
          }
        })
    );
  } catch (err) {
    debug("Error during cleanupUserProfileImages:", err);
  }
}

module.exports = { deleteProfileImageIfExists, cleanupUserProfileImages };

