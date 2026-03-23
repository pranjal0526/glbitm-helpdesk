const app = require("../../backend/src/app");
const connectDB = require("../../backend/src/config/db");

const getSearch = (req) => {
  try {
    const parsedUrl = new URL(req.url || "/", "http://localhost");
    return parsedUrl.search || "";
  } catch (_error) {
    return "";
  }
};

const resolvePath = (pathOrResolver, req) =>
  typeof pathOrResolver === "function" ? pathOrResolver(req) : pathOrResolver;

const createExpressHandler = (pathOrResolver) => async (req, res) => {
  try {
    await connectDB();

    const targetPath = resolvePath(pathOrResolver, req);

    if (targetPath) {
      req.url = `${targetPath}${getSearch(req)}`;
    }

    return app(req, res);
  } catch (error) {
    console.error("Failed to initialize Vercel API function:", error);

    return res.status(500).json({
      success: false,
      message: "Server failed to initialize.",
    });
  }
};

module.exports = createExpressHandler;
