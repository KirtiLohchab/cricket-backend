import Joi from "joi";

/**
 * Validation schema for sending OTP
 */
export const sendOTPSchema = Joi.object({
  phone: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .optional(),
  email: Joi.string().email().optional(),
}).external(async (value) => {
  if (!value.phone && !value.email) {
    throw new Error("Either phone or email must be provided");
  }
});

/**
 * Validation schema for verifying OTP
 */
export const verifyOTPSchema = Joi.object({
  phone: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .optional(),
  email: Joi.string().email().optional(),
  code: Joi.string().required().length(6).pattern(/^\d+$/),
}).external(async (value) => {
  if (!value.phone && !value.email) {
    throw new Error("Either phone or email must be provided");
  }
});

/**
 * Validation schema for player registration
 */
export const registerPlayerSchema = Joi.object({
  firstName: Joi.string().required().trim().min(2).max(50),
  lastName: Joi.string().required().trim().min(2).max(50),
  fatherName: Joi.string().required().trim().min(2).max(50),
  motherName: Joi.string().required().trim().min(2).max(50),
  dateOfBirth: Joi.date().required().max("now").min("1990-01-01"),
  ageCategory: Joi.string().required().valid("UNDER_16", "OPEN_AGE"),
  stateId: Joi.string().required(),
  districtId: Joi.string().required(),
  city: Joi.string().required().trim().min(2).max(50),
  playerRole: Joi.string()
    .required()
    .valid("BATSMAN", "BOWLER", "ALL_ROUNDER", "WICKET_KEEPER"),
  trialStateId: Joi.string().required(),
  trialDistrictId: Joi.string().required(),
});

/**
 * Validation schema for user login
 */
export const loginSchema = Joi.object({
  phone: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().optional(),
}).external(async (value) => {
  if (!value.phone && !value.email) {
    throw new Error("Either phone or email must be provided");
  }
});

/**
 * Validate input data against schema
 * @param {object} data - Data to validate
 * @param {Joi.Schema} schema - Joi schema
 * @returns {object} - { error, value }
 */
export const validateInput = (data, schema) => {
  const { error, value } = schema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errors = error.details.map((detail) => ({
      field: detail.path.join("."),
      message: detail.message,
    }));
    return { error: errors, value: null };
  }

  return { error: null, value };
};

/**
 * Format validation errors
 * @param {array} errors - Array of validation errors
 * @returns {object} - Formatted errors object
 */
export const formatValidationErrors = (errors) => {
  const formatted = {};
  errors.forEach((error) => {
    formatted[error.field] = error.message;
  });
  return formatted;
};
