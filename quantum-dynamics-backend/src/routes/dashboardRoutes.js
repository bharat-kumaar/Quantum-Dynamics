const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// Import all 6 functions explicitly
const {
  getDashboardOverview,
  getDashboardMetrics,
  globalSearch,
  getRecentActivities,
  getNotifications,
  exportData
} = require('../controllers/dashboardController');

// Map the routes
router.get('/', protect, getDashboardOverview);
router.get('/metrics', protect, getDashboardMetrics);
router.get('/search', protect, globalSearch);
router.get('/activities', protect, getRecentActivities);
router.get('/notifications', protect, getNotifications);
router.get('/export', protect, exportData);

module.exports = router;