// ============================================
// IMPORT DEPENDENCIES
// ============================================
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const sendResponse = require("../utils/responseHandler");

// ============================================
// GET ALL TEAM MEMBERS
// ============================================
const getTeamMembers = async (req, res) => {
  try {
    const { role, search } = req.query;

    let filter = {};
    if (role) filter.role = role;

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }

    const teamMembers = await User.find(filter).select("-password");

    sendResponse(res, 200, true, "Team members retrieved successfully", teamMembers);
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

// ============================================
// ADD TEAM MEMBER
// ============================================
const addTeamMember = async (req, res) => {
  try {
    const { name, email, role, department } = req.body;

    if (!name || !email || !role) {
      return sendResponse(res, 400, false, "Name, email, and role are required");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendResponse(res, 400, false, "Email already exists");
    }

    const defaultPassword = `${name.split(" ")[0]}@${Date.now().toString().slice(-6)}`;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(defaultPassword, salt);

    const newMember = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      department: department || ""
    });

    sendResponse(res, 201, true, "Team member added successfully", {
      ...newMember.toObject(),
      temporaryPassword: defaultPassword
    });
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

// ============================================
// UPDATE TEAM MEMBER
// ============================================
const updateTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, department, avatar } = req.body;

    const member = await User.findById(id);
    if (!member) {
      return sendResponse(res, 404, false, "Team member not found");
    }

    if (email && email !== member.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return sendResponse(res, 400, false, "Email already in use");
      }
    }

    if (name) member.name = name;
    if (email) member.email = email;
    if (role) member.role = role;
    if (department) member.department = department;
    if (avatar) member.avatar = avatar;

    await member.save();

    sendResponse(res, 200, true, "Team member updated successfully", member);
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

// ============================================
// REMOVE TEAM MEMBER
// ============================================
const removeTeamMember = async (req, res) => {
  try {
    const { id } = req.params;

    const member = await User.findByIdAndDelete(id);
    if (!member) {
      return sendResponse(res, 404, false, "Team member not found");
    }

    sendResponse(res, 200, true, "Team member removed successfully", member);
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

// ============================================
// EXPORT CONTROLLERS
// ============================================
module.exports = {
  getTeamMembers,
  addTeamMember,
  updateTeamMember,
  removeTeamMember
};
