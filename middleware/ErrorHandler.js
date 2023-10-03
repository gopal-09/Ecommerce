const { httpResponse } = require("../helpers/helper");
const { CustomApiError } = require("../errors/customApiError");
exports.errorHandler = (err, req, res, next) => {
  console.error(`Error ${err.statusCode}: ${err.message}`);
  return res.status(err.statusCode).json(httpResponse(false, err.message, {}));
};
