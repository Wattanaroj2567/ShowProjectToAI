const express = require("express");
const router = express.Router();
const userController = require("./user-controller");
const { authenticate } = require("../auth/auth-middleware");
const upload = require("./upload-middleware");

router.use(authenticate);

router.get("/profile", userController.getProfile);
router.put("/profile", upload.single("profileImage"), userController.updateProfile);
router.put("/email", userController.updateEmail);
router.put("/password", userController.updatePassword);

module.exports = router;

