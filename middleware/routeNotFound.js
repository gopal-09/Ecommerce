const { NotFoundError } = require("../errors/notFoundError");
exports.routeNotFound = (req, res) => {
  throw new NotFoundError("Bad method or route does not exist");
};
