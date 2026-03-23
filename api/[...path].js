const app = require("../backend/src/app");
const connectDB = require("../backend/src/config/db");

module.exports = async (req, res) => {
  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error("Failed to initialize Vercel API function:", error);

    return res.status(500).json({
      success: false,
      message: "Server failed to initialize.",
    });
  }
};
