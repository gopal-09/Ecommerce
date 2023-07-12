// Compilation of common errors for reuse, throw them as needed
// Express intercepts exceptions and sends them to the error handler

// import  NotFoundError  from "./notFoundError";
// import  BadRequestError  from "./badRequestError";
// import  ForbiddenError  from "./forbiddenError";
// import  UnauthorizedError  from "./unauthorizedError";
// import  InternalServerError  from "./internalServerError";
const  {NotFoundError } = require("./notFoundError");
const  {BadRequestError}  = require("./badRequestError");
const  {ForbiddenError}  = require("./forbiddenError");
const  {UnauthorizedError}  = require("./unauthorizedError");
const  {InternalServerError}  = require("./internalServerError");
module.exports = {
  NotFoundError,
  BadRequestError,
  ForbiddenError,
  UnauthorizedError,
  InternalServerError,
};

// export 
//   NotFoundError,
//   BadRequestError,
//   ForbiddenError,
//   UnauthorizedError,
//   InternalServerError,
// ;
