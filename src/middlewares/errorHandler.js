import AppError from "../utils/AppError.js";

// ─── Prisma-specific error translators ────────────────────────────────────────

const handlePrismaUniqueConstraint = () =>
  new AppError("A record with that value already exists.", 409);

const handlePrismaNotFound = () =>
  new AppError("The requested resource does not exist.", 404);

const handlePrismaValidation = (err) =>
  new AppError(`Invalid input data: ${err.message}`, 400);

// ─── JWT error translators ────────────────────────────────────────────────────

const handleJWTError = () =>
  new AppError("Invalid token. Please log in again.", 401);

const handleJWTExpiredError = () =>
  new AppError("Your token has expired. Please log in again.", 401);

// ─── Response helpers ─────────────────────────────────────────────────────────

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

const sendErrorProd = (err, res) => {
  // Operational errors: safe to expose to the client
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // Programming / unknown errors: don't leak details
  console.error("UNHANDLED ERROR:", err);
  return res.status(500).json({
    status: "error",
    message: "Something went wrong. Please try again later.",
  });
};

// ─── Global error-handling middleware ─────────────────────────────────────────

// eslint-disable-next-line no-unused-vars
const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    return sendErrorDev(err, res);
  }

  // Make a shallow copy so we don't mutate the original error object
  let error = Object.assign(Object.create(Object.getPrototypeOf(err)), err);
  error.message = err.message;

  // Translate known library errors into operational AppErrors
  if (err.code === "P2002") error = handlePrismaUniqueConstraint();
  if (err.code === "P2025") error = handlePrismaNotFound();
  if (err.name === "PrismaClientValidationError")
    error = handlePrismaValidation(err);
  if (err.name === "JsonWebTokenError") error = handleJWTError();
  if (err.name === "TokenExpiredError") error = handleJWTExpiredError();

  return sendErrorProd(error, res);
};

export default globalErrorHandler;
