// import { CustomApiError } from "./customApiError";
// import { StatusCodes } from "http-status-codes";
const CustomApiError = require("./customApiError");
const StatusCodes = require("http-status-codes").StatusCodes;

class NotFoundError extends CustomApiError {
  constructor(message) {
    super(message, StatusCodes.NOT_FOUND);
  }
}

module.exports = {NotFoundError};

