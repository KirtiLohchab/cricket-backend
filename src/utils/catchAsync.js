/**
 * Wraps an async route handler so Express receives any rejected promise
 * automatically — no try/catch boilerplate in controllers.
 */
const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default catchAsync;
