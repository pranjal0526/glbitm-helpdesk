const express = require("express");

const {
  createComplaint,
  getComplaints,
  updateComplaintStatus,
} = require("../controllers/complaint.controller");
const authenticate = require("../middleware/auth.middleware");
const authorize = require("../middleware/authorize.middleware");

const router = express.Router();

router.use(authenticate);

router.route("/").post(authorize("student"), createComplaint).get(getComplaints);

router.patch("/:id", authorize("admin"), updateComplaintStatus);

module.exports = router;

