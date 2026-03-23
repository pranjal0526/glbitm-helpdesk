const mongoose = require("mongoose");

const Counter = require("./Counter");

const complaintSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    category: {
      type: String,
      required: true,
      enum: ["hostel", "classroom"],
      trim: true,
    },
    floor: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },
    roomNumber: {
      type: String,
      required: true,
      trim: true,
      maxlength: 40,
    },
    issueType: {
      type: String,
      required: true,
      trim: true,
      maxlength: 40,
    },
    otherIssueText: {
      type: String,
      trim: true,
      maxlength: 200,
      default: undefined,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },
    status: {
      type: String,
      enum: ["open", "in-progress", "resolved"],
      default: "open",
    },
    assignedTo: {
      type: String,
      trim: true,
      maxlength: 120,
      default: undefined,
    },
    adminNote: {
      type: String,
      trim: true,
      maxlength: 500,
      default: undefined,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
    toJSON: {
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        ret._id = ret.id;
        return ret;
      },
    },
  }
);

complaintSchema.index({ status: 1, createdAt: -1 });
complaintSchema.index({ category: 1, createdAt: -1 });

complaintSchema.pre("validate", async function generateTicketDetails() {
  if (!this.title && this.issueType && this.category) {
    const issueLabel =
      this.issueType === "other" && this.otherIssueText
        ? this.otherIssueText
        : this.issueType;

    this.title = `${issueLabel} issue - ${this.category}`;
  }

  if (this.ticketId) {
    return;
  }

  const counter = await Counter.findOneAndUpdate(
    { key: "complaint-ticket-sequence" },
    { $inc: { value: 1 } },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }
  );

  this.ticketId = `GLB-${String(counter.value).padStart(4, "0")}`;
});

module.exports = mongoose.model("Complaint", complaintSchema);
