// ============================================
// CENTRALIZED RESPONSE HANDLER
// ============================================

const sendResponse = (res, statusCode, success, message, data = null, extra = {}) => {
  const response = {
    success,
    message,
  };

  if (data !== null && data !== undefined) {
    response.data = data;
  }

  if (extra && typeof extra === 'object' && Object.keys(extra).length > 0) {
    Object.assign(response, extra);
  }

  return res.status(statusCode).json(response);
};

module.exports = sendResponse;
