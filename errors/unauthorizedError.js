// import { CustomApiError } from "./customApiError";
// import { StatusCodes } from "http-status-codes";

// class UnauthorizedError extends CustomApiError {
//   constructor(message) {
//     super(message, StatusCodes.UNAUTHORIZED);
//   }
// }

// export { UnauthorizedError };
const CustomApiError = require("./customApiError");
const StatusCodes= require("http-status-codes");

class UnauthorizedError extends CustomApiError {
  constructor(message) {
    super(message, StatusCodes.UNAUTHORIZED);
  }
}

module.exports = { UnauthorizedError };

