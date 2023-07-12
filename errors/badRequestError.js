// import { CustomApiError } from "./customApiError";
// import { StatusCodes } from "http-status-codes";
const CustomApiError = require("./customApiError");
const StatusCodes = require("http-status-codes").StatusCodes;

// class BadRequestError extends CustomApiError {
//   constructor(message) {
//     super(message, StatusCodes.BAD_REQUEST);
//   }
// }
class BadRequestError extends CustomApiError {
  constructor(message) {
    super(message, StatusCodes.BAD_REQUEST);
  }
}


module.exports={BadRequestError};
