const Project = require("../models/project");
const User = require("../models/user"); 
const sendResponse = require("../utils/responseHandler");

// ============================================
// DASHBOARD OVERVIEW
// ============================================
const getDashboardOverview = async (req, res) => {
  try {
    const totalProjects = await Project.countDocuments();
    const activeProjectsCount = await Project.countDocuments({ status: { $ne: "COMPLETED" } });

    sendResponse(res, 200, true, "Dashboard overview fetched successfully", {
      totalProjects,
      activeProjectsCount
    });
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

// ============================================
// DASHBOARD METRICS
// ============================================
const getDashboardMetrics = async (req, res) => {
  try {
    const totalProjects = await Project.countDocuments({});
    const completedProjects = await Project.countDocuments({ status: "COMPLETED" });
    const activeProjects = Math.max(0, totalProjects - completedProjects);

    const data = {
      totalProjects,
      activeProjects,
      completedProjects,
      utilization: {
        percentage: totalProjects === 0 ? 0 : Math.round((activeProjects / totalProjects) * 100)
      }
    };
    sendResponse(res, 200, true, "Dashboard metrics fetched", data);
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

// ============================================
// GLOBAL SEARCH
// ============================================
const globalSearch = async (req, res) => {
  try {
    const query = (req.query.q || "").toString().trim();

    if (!query) {
      return sendResponse(res, 200, true, "No search query provided", { projects: [], users: [] });
    }

    const regex = new RegExp(query, "i");

    const [projects, users] = await Promise.all([
      Project.find({ $or: [{ name: regex }, { client: regex }] }).limit(10),
      User.find({ $or: [{ name: regex }, { email: regex }, { department: regex }] }).limit(10)
    ]);

    sendResponse(res, 200, true, "Global search completed", { projects, users });
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

// ============================================
// RECENT ACTIVITIES
// ============================================
const getRecentActivities = async (req, res) => {
  try {
    const recentProjects = await Project.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("createdBy", "name avatar");

    const activities = recentProjects.map(proj => ({
      user: proj.createdBy?.name || "System",
      action: "created a new project",
      target: proj.name || "Unknown Database",
      time: proj.createdAt || new Date()
    }));

    sendResponse(res, 200, true, "Recent activities fetched successfully", activities);
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

// ============================================
// NOTIFICATIONS
// ============================================
const getNotifications = async (req, res) => {
  try {
    const upcomingProjects = await Project.find({ status: "IN PROGRESS" })
      .sort({ dueDate: 1 })
      .limit(2);
    
    const notifications = upcomingProjects.map(p => ({
      _id: p._id.toString(),
      title: `Project Deadline Approaching`,
      message: `${p.name} for ${p.client} requires attention.`,
      type: 'warning',
      time: p.updatedAt || new Date()
    }));

    notifications.unshift({
      _id: `sys-${Date.now()}`,
      title: "New Login Detected",
      message: "Access granted from authorized IP address.",
      type: "security",
      time: new Date()
    });

    sendResponse(res, 200, true, "Notifications fetched successfully", notifications);
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

// ============================================
// EXPORT DATA (CSV)
// ============================================
const exportData = async (req, res) => {
  try {
    const projects = await Project.find().populate('createdBy', 'name').lean();
    
    const headers = ['Project Name', 'Client', 'Status', 'Due Date', 'Created By'];
    
    const csvRows = projects.map(p => {
      const dueDate = p.dueDate ? new Date(p.dueDate).toISOString().split('T')[0] : 'N/A';
      const createdBy = p.createdBy?.name || 'System';
      
      const safeName = (p.name || "").replace(/"/g, '""');
      const safeClient = (p.client || "").replace(/"/g, '""');
      const safeStatus = (p.status || "").replace(/"/g, '""');
      
      return `"${safeName}","${safeClient}","${safeStatus}","${dueDate}","${createdBy}"`;
    });
    
    const csvString = [headers.join(','), ...csvRows].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="quantum_dynamics_report.csv"');
    res.status(200).send(csvString);
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

module.exports = {
  getDashboardOverview,
  getDashboardMetrics,
  globalSearch,
  getRecentActivities,
  getNotifications,
  exportData
};
