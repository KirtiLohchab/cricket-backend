import nodemailer from "nodemailer";

// Configure SMTP transporter
const configureTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10),
    secure: process.env.SMTP_PORT === "465", // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const transporter = configureTransporter();

/**
 * Send OTP email
 * @param {string} email - Recipient email
 * @param {string} otp - OTP code
 * @param {string} userName - User name (optional)
 * @returns {Promise<object>} - Email send result
 */
export const sendOTPEmail = async (email, otp, userName = "User") => {
  try {
    const htmlContent = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h2 style="color: #2c3e50; text-align: center;">Cricket Registration - OTP Verification</h2>
            <p>Hi <strong>${userName}</strong>,</p>
            <p>Your One-Time Password (OTP) for verification is:</p>
            <div style="text-align: center; padding: 20px;">
              <span style="font-size: 32px; font-weight: bold; color: #3498db; letter-spacing: 5px;">${otp}</span>
            </div>
            <p style="color: #e74c3c;"><strong>This OTP will expire in 10 minutes.</strong></p>
            <p>If you didn't request this code, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="font-size: 12px; color: #7f8c8d; text-align: center;">
              © 2024 Cricket Application. All rights reserved.
            </p>
          </div>
        </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.SMTP_FROM || "noreply@cricket.com",
      to: email,
      subject: "Your OTP for Cricket Registration",
      html: htmlContent,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("OTP email sent successfully:", result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("Error sending OTP email:", error.message);
    throw new Error(`Failed to send OTP email: ${error.message}`);
  }
};

/**
 * Send welcome email
 * @param {string} email - Recipient email
 * @param {string} firstName - User first name
 * @returns {Promise<object>} - Email send result
 */
export const sendWelcomeEmail = async (email, firstName) => {
  try {
    const htmlContent = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h2 style="color: #2c3e50; text-align: center;">Welcome to Cricket Registration!</h2>
            <p>Hi <strong>${firstName}</strong>,</p>
            <p>Welcome to our cricket platform! Your registration has been completed successfully.</p>
            <p>You can now:</p>
            <ul style="color: #34495e;">
              <li>View your player profile</li>
              <li>Check trial opportunities</li>
              <li>Update your information</li>
              <li>Track selection updates</li>
            </ul>
            <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="font-size: 12px; color: #7f8c8d; text-align: center;">
              © 2024 Cricket Application. All rights reserved.
            </p>
          </div>
        </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.SMTP_FROM || "noreply@cricket.com",
      to: email,
      subject: "Welcome to Cricket Registration Platform",
      html: htmlContent,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Welcome email sent successfully:", result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("Error sending welcome email:", error.message);
    throw new Error(`Failed to send welcome email: ${error.message}`);
  }
};

/**
 * Send login confirmation email
 * @param {string} email - Recipient email
 * @param {string} firstName - User first name
 * @param {string} timestamp - Login timestamp
 * @returns {Promise<object>} - Email send result
 */
export const sendLoginConfirmationEmail = async (
  email,
  firstName,
  timestamp,
) => {
  try {
    const htmlContent = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h2 style="color: #2c3e50; text-align: center;">Login Confirmation</h2>
            <p>Hi <strong>${firstName}</strong>,</p>
            <p>You have successfully logged into your Cricket account.</p>
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0;"><strong>Login Time:</strong> ${new Date(timestamp).toLocaleString()}</p>
            </div>
            <p>If this wasn't you, please secure your account by changing your password immediately.</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="font-size: 12px; color: #7f8c8d; text-align: center;">
              © 2024 Cricket Application. All rights reserved.
            </p>
          </div>
        </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.SMTP_FROM || "noreply@cricket.com",
      to: email,
      subject: "Login Confirmation - Cricket Account",
      html: htmlContent,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(
      "Login confirmation email sent successfully:",
      result.messageId,
    );
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("Error sending login confirmation email:", error.message);
    throw new Error(
      `Failed to send login confirmation email: ${error.message}`,
    );
  }
};

/**
 * Send profile update notification email
 * @param {string} email - Recipient email
 * @param {string} firstName - User first name
 * @param {array} updatedFields - List of updated fields
 * @returns {Promise<object>} - Email send result
 */
export const sendProfileUpdateEmail = async (
  email,
  firstName,
  updatedFields = [],
) => {
  try {
    const fieldsList = updatedFields
      .map((field) => `<li>${field}</li>`)
      .join("");

    const htmlContent = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h2 style="color: #2c3e50; text-align: center;">Profile Updated</h2>
            <p>Hi <strong>${firstName}</strong>,</p>
            <p>Your profile has been successfully updated with the following changes:</p>
            <ul style="color: #34495e;">
              ${fieldsList}
            </ul>
            <p>If you didn't make these changes, please contact our support team immediately.</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="font-size: 12px; color: #7f8c8d; text-align: center;">
              © 2024 Cricket Application. All rights reserved.
            </p>
          </div>
        </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.SMTP_FROM || "noreply@cricket.com",
      to: email,
      subject: "Your Profile Has Been Updated",
      html: htmlContent,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Profile update email sent successfully:", result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("Error sending profile update email:", error.message);
    throw new Error(`Failed to send profile update email: ${error.message}`);
  }
};
