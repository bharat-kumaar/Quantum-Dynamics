const express = require("express");
const router = express.Router();

const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  createBulkProjects,
  assignTeamToProject,
  addMilestone
} = require("../controllers/projectController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createProject);
router.post("/bulk", protect, createBulkProjects);
router.get("/", protect, getProjects);
router.get("/:id", protect, getProjectById);
router.put("/:id", protect, updateProject);
router.put("/:id/team", protect, assignTeamToProject);
router.post("/:id/milestones", protect, addMilestone);
router.delete("/:id", protect, deleteProject);

module.exports = router;