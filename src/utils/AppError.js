/**
 * Operational (expected) error — carries HTTP status code and is safe to
 * send to the client as-is.  All unexpected errors fall through to the
 * global error handler which returns a generic 500.
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = String(statusCode).startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    // Keep the prototype chain intact for instanceof checks
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
