// ============================================
// IMPORT DEPENDENCIES
// ============================================
const Project = require("../models/project");
const User = require("../models/user");
const sendResponse = require("../utils/responseHandler");

// ============================================
// CREATE PROJECT
// ============================================
const createProject = async (req, res) => {
  try {
    const { name, description, client, status, dueDate, teamLead, attachments } = req.body;

    const project = await Project.create({
      name,
      description,
      client,
      status,
      dueDate,
      teamLead,
      attachments: attachments || [],
      createdBy: req.user.id
    });

    sendResponse(res, 201, true, "Project created successfully", project);
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

// ============================================
// GET ALL PROJECTS (WITH FILTERING, SEARCHING & PAGINATION)
// ============================================
const getProjects = async (req, res) => {
  try {
    let filter = {};

    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: "i" } },
        { client: { $regex: req.query.search, $options: "i" } }
      ];
    }

    if (req.query.status && req.query.status !== "All") {
      filter.status = req.query.status;
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const total = await Project.countDocuments(filter);

    const projects = await Project.find(filter)
      .select("name client status dueDate teamLead createdBy _id") 
      .populate("createdBy", "name email")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    sendResponse(res, 200, true, "Projects fetched successfully", projects, {
      pagination: { total, page, limit, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

// ============================================
// GET PROJECT BY ID
// ============================================
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("team", "name email role department"); 

    if (!project) {
      return sendResponse(res, 404, false, "Project not found");
    }

    sendResponse(res, 200, true, "Project fetched successfully", project);
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

// ============================================
// UPDATE PROJECT
// ============================================
const updateProject = async (req, res) => {
  try {
    const { name, description, status, dueDate, teamLead, attachments } = req.body;

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { name, description, status, dueDate, teamLead, attachments },
      { new: true, runValidators: true }
    ).populate("createdBy", "name email");

    if (!project) {
      return sendResponse(res, 404, false, "Project not found");
    }

    sendResponse(res, 200, true, "Project updated successfully", project);
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

// ============================================
// DELETE PROJECT
// ============================================
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return sendResponse(res, 404, false, "Project not found");
    }

    sendResponse(res, 200, true, "Project deleted successfully", project);
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

// ============================================
// CREATE BULK PROJECTS
// ============================================
const createBulkProjects = async (req, res) => {
  try {
    const { projects } = req.body;
    
    if (!projects || !Array.isArray(projects)) {
      return sendResponse(res, 400, false, "Invalid or missing projects array");
    }

    const userId = req.user ? (req.user._id || req.user.id || req.user) : null;

    if (!userId) {
      return sendResponse(res, 401, false, "User authentication context missing in request");
    }

    const projectsWithUser = projects.map(project => {
      const cleanProject = { ...project };
      cleanProject.createdBy = userId;
      return cleanProject;
    });

    const insertedData = await Project.insertMany(projectsWithUser);

    sendResponse(res, 201, true, "All mock projects inserted successfully", { count: insertedData.length });
  } catch (error) {
    sendResponse(res, 500, false, "Server error during bulk project insertion", { errorDetails: error.message });
  }
};

// ============================================
// ASSIGN TEAM TO PROJECT
// ============================================
const assignTeamToProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { teamMemberIds } = req.body;

    if (!teamMemberIds || !Array.isArray(teamMemberIds)) {
      return sendResponse(res, 400, false, "teamMemberIds must be an array");
    }

    const project = await Project.findByIdAndUpdate(
      id,
      { $addToSet: { team: { $each: teamMemberIds } } },
      { new: true, runValidators: true }
    )
      .populate("createdBy", "name email")
      .populate("team", "name email role department");

    if (!project) {
      return sendResponse(res, 404, false, "Project not found");
    }

    sendResponse(res, 200, true, "Team members assigned to project successfully", project);
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

// ============================================
// ADD MILESTONE TO PROJECT
// ============================================
const addMilestone = async (req, res) => {
  try {
    const { title, status, dueDate } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return sendResponse(res, 404, false, "Project not found");
    }

    project.milestones.push({ title, status, dueDate });
    await project.save();

    sendResponse(res, 201, true, "Milestone added successfully", project);
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

// ============================================
// EXPORT CONTROLLERS
// ============================================
module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  createBulkProjects,
  assignTeamToProject,
  addMilestone
};
