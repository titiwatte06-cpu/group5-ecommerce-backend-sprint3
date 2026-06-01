export const errorHandler = (err, req, res, next) => {
  console.error("🔴 Error caught:", err.message);

  let statusCode = err.status || 500; //Use let to prevent fatal crash if next error happen.
  let message = err.message || "Internal Server Error!"; //Use let to prevent fatal crash if next error happen.

  //Mongoose bad object format.
  if (err.name === "CastError") {
    ((statusCode = 400),
      (message = `The provided ID format '${err.value}' is invalid!`));
  }

  //Mongoose validation error (e.g. missing require field(s).)
  if (err.name === "ValidationError") {
    //Show all error field(s).
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  //MongoDB Duplicate key errors
  if (err.code === 11000) {
    statusCode = 400;
    const duplicatedField = Object.keys(err.keyValue)[0];
    message = `Key ${duplicatedField} already exists`;
  }

  //Send can understand message to frontend in JSON.
  res.status(statusCode).json({
    success: false,
    error: {
      status: statusCode,
      message: message,
      path: req.originalUrl,
      method: req.method,
      timestamp: new Date().toISOString(),
    },
  });
};
