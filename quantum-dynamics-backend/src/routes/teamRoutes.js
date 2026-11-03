// ============================================
// IMPORT DEPENDENCIES
// ============================================

const express = require("express");
const router = express.Router();

const {
  getTeamMembers,
  addTeamMember,
  updateTeamMember,
  removeTeamMember
} = require("../controllers/teamController");

const { protect, admin } = require("../middleware/authMiddleware");

// ============================================
// TEAM ROUTES
// ============================================

// Get all team members - GET /api/team/
router.get("/", protect, getTeamMembers);

// Add new team member - POST /api/team/
router.post("/", protect, admin, addTeamMember);

// Update team member - PUT /api/team/:id
router.put("/:id", protect, admin, updateTeamMember);

// Remove team member - DELETE /api/team/:id
router.delete("/:id", protect, admin, removeTeamMember);

// ============================================
// EXPORT ROUTER
// ============================================

module.exports = router;
