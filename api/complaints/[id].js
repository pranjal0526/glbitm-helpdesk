const createExpressHandler = require("../_utils/createExpressHandler");

const getComplaintId = (req) => {
  const id = Array.isArray(req.query?.id) ? req.query.id[0] : req.query?.id;
  return id ? `/api/complaints/${id}` : "/api/complaints";
};

module.exports = createExpressHandler(getComplaintId);
