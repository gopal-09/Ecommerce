// import { CustomApiError } from "./customApiError";
// import { StatusCodes } from "http-status-codes";

// class InternalServerError extends CustomApiError {
//   constructor(message) {
//     super(message, StatusCodes.INTERNAL_SERVER_ERROR);
//   }
// }

// export { InternalServerError };
const CustomApiError = require("./customApiError");
const StatusCodes = require("http-status-codes");

class InternalServerError extends CustomApiError {
  constructor(message) {
    super(message, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

module.exports = { InternalServerError };

