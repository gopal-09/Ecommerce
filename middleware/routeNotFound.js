const { NotFoundError } = require("../errors/notFoundError");

exports.routeNotFound = (_req, _res) => {
  throw new NotFoundError("Bad method or route does not exist");
};
