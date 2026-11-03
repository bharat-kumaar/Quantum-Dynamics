const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ["User", "admin", "Team Lead","member" ,"Developer", "Project Manager"],
      default: "User"
    },

    department: {
      type: String,
      default: "General"
    },

    avatar: {
      type: String,
      default: ""
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.models.User || mongoose.model(
  "User",
  userSchema
);

