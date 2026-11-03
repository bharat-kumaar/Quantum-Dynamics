const mongoose = require("mongoose");

// ============================================
// PROJECT SCHEMA
// ============================================

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String
    },
    client: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: ["PLANNING", "IN PROGRESS", "COMPLETED"],
      default: "PLANNING"
    },
    dueDate: {
      type: Date
    },
    teamLead: {
      type: String
    },
    attachments: [{ // Relation setup: Links to Media table
      type: mongoose.Schema.Types.ObjectId,
      ref: "Media"
    }],
    team: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }],
    // NEW: Milestones Array added for the Project Details timeline
    milestones: [{
      title: { type: String, required: true },
      status: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" },
      dueDate: { type: Date },
      createdAt: { type: Date, default: Date.now }
    }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

// Prevent OverwriteModelError in Next.js/Node hot-reloads
module.exports = mongoose.models.Project || mongoose.model("Project", projectSchema);