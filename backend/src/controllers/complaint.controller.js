const mongoose = require("mongoose");

const Complaint = require("../models/Complaint");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");
const { getEnumValue, getString } = require("../utils/validators");

const complaintPopulation = {
  path: "createdBy",
  select: "name email role profilePicture createdAt",
};

const allowedStatuses = ["open", "in-progress", "resolved"];
const allowedCategories = ["hostel", "classroom"];
const allowedIssueTypes = [
  "fan",
  "light",
  "ac",
  "window",
  "door",
  "projector",
  "table",
  "chair",
  "other",
];

const normalizeStatus = (status) => {
  if (!status) {
    return status;
  }

  return status === "pending" ? "open" : status;
};

const serializeComplaint = (complaintDocument) => {
  const complaint = complaintDocument.toJSON();

  if (complaint.createdBy) {
    complaint.student = complaint.createdBy;
  }

  return complaint;
};

const createComplaint = asyncHandler(async (req, res) => {
  const category = getEnumValue(
    req.body.category,
    "category",
    allowedCategories
  );
  const floor = getString(req.body.floor, "floor", {
    min: 1,
    max: 20,
  });
  const roomNumber = getString(req.body.roomNumber, "roomNumber", {
    min: 1,
    max: 40,
  });
  const issueType = getEnumValue(
    req.body.issueType,
    "issueType",
    allowedIssueTypes
  );
  const otherIssueText = getString(
    req.body.otherIssueText || req.body.otherIssue,
    "otherIssueText",
    {
      optional: true,
      max: 200,
    }
  );
  const description = getString(req.body.description, "description", {
    optional: true,
    max: 2000,
  });

  if (issueType === "other" && !otherIssueText) {
    throw new ApiError(
      400,
      "Please describe the issue when you choose 'other'."
    );
  }

  const complaint = await Complaint.create({
    category,
    floor,
    roomNumber,
    issueType,
    otherIssueText,
    description: description || "",
    createdBy: req.user._id,
  });

  await complaint.populate(complaintPopulation);

  return res.status(201).json({
    success: true,
    message: "Complaint submitted successfully.",
    complaint: serializeComplaint(complaint),
  });
});

const getComplaints = asyncHandler(async (req, res) => {
  const query = req.user.role === "admin" ? {} : { createdBy: req.user._id };

  if (req.query.status) {
    query.status = getEnumValue(
      normalizeStatus(req.query.status),
      "status",
      allowedStatuses
    );
  }

  if (req.query.category) {
    query.category = getEnumValue(
      req.query.category,
      "category",
      allowedCategories
    );
  }

  let complaintQuery = Complaint.find(query)
    .populate(complaintPopulation)
    .sort({ createdAt: -1 });

  if (req.query.limit) {
    const limit = Number(req.query.limit);

    if (Number.isNaN(limit) || limit < 1 || limit > 100) {
      throw new ApiError(400, "limit must be a number between 1 and 100.");
    }

    complaintQuery = complaintQuery.limit(limit);
  }

  const complaints = await complaintQuery;
  const serializedComplaints = complaints.map(serializeComplaint);

  return res.status(200).json({
    success: true,
    count: serializedComplaints.length,
    complaints: serializedComplaints,
  });
});

const updateComplaintStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid complaint id.");
  }

  const status = getEnumValue(
    normalizeStatus(req.body.status),
    "status",
    allowedStatuses
  );
  const assignedTo = getString(req.body.assignedTo, "assignedTo", {
    optional: true,
    max: 120,
  });
  const adminNote = getString(req.body.adminNote, "adminNote", {
    optional: true,
    max: 500,
  });

  const complaint = await Complaint.findById(id).populate(complaintPopulation);

  if (!complaint) {
    throw new ApiError(404, "Complaint not found.");
  }

  complaint.status = status;

  if ("assignedTo" in req.body) {
    complaint.assignedTo = assignedTo;
  }

  if ("adminNote" in req.body) {
    complaint.adminNote = adminNote;
  }

  await complaint.save();
  await complaint.populate(complaintPopulation);

  return res.status(200).json({
    success: true,
    message: "Complaint updated successfully.",
    complaint: serializeComplaint(complaint),
  });
});

module.exports = {
  createComplaint,
  getComplaints,
  updateComplaintStatus,
};
