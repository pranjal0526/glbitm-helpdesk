const express = require("express");

const {
  googleLogin,
  verifyAdminAccessCode,
} = require("../controllers/auth.controller");

const router = express.Router();

router.post("/google-login", googleLogin);
router.post("/google", googleLogin);
router.post("/admin-verify", verifyAdminAccessCode);

module.exports = router;
