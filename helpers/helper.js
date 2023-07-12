 const httpResponse = (success, message, data) => {
    return Object.freeze({
      success,
      message,
      data,
    });
  };
  module.exports =httpResponse;

  