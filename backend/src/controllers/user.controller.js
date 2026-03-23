const asyncHandler = require("../utils/asyncHandler");

const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
});

module.exports = {
  getCurrentUser,
};

