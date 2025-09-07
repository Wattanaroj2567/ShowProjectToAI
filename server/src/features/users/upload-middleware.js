const multer = require("multer");
const path = require("path");
const fs = require("fs");
const debug = require("debug")("fictionbook:upload");

const uploadPath = path.join(__dirname, "../../../uploads/profiles");
debug("Resolved upload path: %s", uploadPath);

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
  debug("Created upload directory: %s", uploadPath);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    debug("storage.destination: original=%s, mimetype=%s", file?.originalname, file?.mimetype);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const uid = req?.user?.id || "anon";
    const name = `profile-${uid}-${uniqueSuffix}${ext}`;
    debug(
      "storage.filename: original=%s, ext=%s, unique=%s, user=%s, name=%s",
      file?.originalname,
      ext,
      uniqueSuffix,
      uid,
      name
    );
    cb(null, name);
  },
});

const allowedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);

const fileFilter = (req, file, cb) => {
  const isImageType = (file.mimetype || "").startsWith("image/");
  const ext = (path.extname(file.originalname) || "").toLowerCase();
  debug("fileFilter: original=%s, mimetype=%s, ext=%s, isImageType=%s", file?.originalname, file?.mimetype, ext, isImageType);
  if (isImageType && allowedExtensions.has(ext)) {
    debug("fileFilter: accepted %s", file?.originalname);
    return cb(null, true);
  }
  debug("fileFilter: rejected %s (invalid type or extension)", file?.originalname);
  return cb(new Error("อนุญาตเฉพาะไฟล์รูปภาพ .jpg .jpeg .png .webp"), false);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 3 * 1024 * 1024 },
});

module.exports = upload;
