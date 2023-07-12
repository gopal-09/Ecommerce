// import { CustomApiError } from "./customApiError";
// import { StatusCodes } from "http-status-codes";

// class ForbiddenError extends CustomApiError {
//   constructor(message) {
//     super(message, StatusCodes.FORBIDDEN);
//   }
// }

// export { ForbiddenError };
const CustomApiError = require("./customApiError");
const { StatusCodes } = require("http-status-codes");

class ForbiddenError extends CustomApiError {
  constructor(message) {
    super(message, StatusCodes.FORBIDDEN);
  }
}

module.exports = { ForbiddenError };

