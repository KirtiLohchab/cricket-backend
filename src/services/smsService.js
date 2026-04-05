import twilio from "twilio";

// Initialize Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);

/**
 * Send OTP via SMS
 * @param {string} phone - Phone number (with country code)
 * @param {string} otp - OTP code
 * @returns {Promise<object>} - SMS send result
 */
export const sendOTPSMS = async (phone, otp) => {
  try {
    // Format phone number
    let formattedPhone = phone;
    if (!phone.startsWith("+")) {
      formattedPhone = `+${phone}`;
    }

    const message = await client.messages.create({
      body: `Your Cricket Registration OTP is: ${otp}. This code will expire in 10 minutes. Do not share this OTP with anyone.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedPhone,
    });

    console.log("OTP SMS sent successfully:", message.sid);
    return {
      success: true,
      messageSid: message.sid,
      to: formattedPhone,
    };
  } catch (error) {
    console.error("Error sending OTP SMS:", error.message);
    throw new Error(`Failed to send OTP SMS: ${error.message}`);
  }
};

/**
 * Send welcome SMS
 * @param {string} phone - Phone number (with country code)
 * @param {string} firstName - User first name
 * @returns {Promise<object>} - SMS send result
 */
export const sendWelcomeSMS = async (phone, firstName) => {
  try {
    let formattedPhone = phone;
    if (!phone.startsWith("+")) {
      formattedPhone = `+${phone}`;
    }

    const message = await client.messages.create({
      body: `Welcome ${firstName}! Your cricket registration is complete. You can now start exploring opportunities on our platform. Thank you for joining us!`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedPhone,
    });

    console.log("Welcome SMS sent successfully:", message.sid);
    return {
      success: true,
      messageSid: message.sid,
      to: formattedPhone,
    };
  } catch (error) {
    console.error("Error sending welcome SMS:", error.message);
    throw new Error(`Failed to send welcome SMS: ${error.message}`);
  }
};

/**
 * Send login greeting SMS
 * @param {string} phone - Phone number (with country code)
 * @param {string} firstName - User first name
 * @returns {Promise<object>} - SMS send result
 */
export const sendLoginGreetingSMS = async (phone, firstName) => {
  try {
    let formattedPhone = phone;
    if (!phone.startsWith("+")) {
      formattedPhone = `+${phone}`;
    }

    const message = await client.messages.create({
      body: `Welcome back ${firstName}! You have successfully logged into your Cricket account. Explore new trial opportunities and updates today!`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedPhone,
    });

    console.log("Login greeting SMS sent successfully:", message.sid);
    return {
      success: true,
      messageSid: message.sid,
      to: formattedPhone,
    };
  } catch (error) {
    console.error("Error sending login greeting SMS:", error.message);
    throw new Error(`Failed to send login greeting SMS: ${error.message}`);
  }
};

/**
 * Send profile update notification SMS
 * @param {string} phone - Phone number (with country code)
 * @param {string} firstName - User first name
 * @returns {Promise<object>} - SMS send result
 */
export const sendProfileUpdateSMS = async (phone, firstName) => {
  try {
    let formattedPhone = phone;
    if (!phone.startsWith("+")) {
      formattedPhone = `+${phone}`;
    }

    const message = await client.messages.create({
      body: `Hi ${firstName}, your profile has been successfully updated. Check the app to view your latest information.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedPhone,
    });

    console.log("Profile update SMS sent successfully:", message.sid);
    return {
      success: true,
      messageSid: message.sid,
      to: formattedPhone,
    };
  } catch (error) {
    console.error("Error sending profile update SMS:", error.message);
    throw new Error(`Failed to send profile update SMS: ${error.message}`);
  }
};

/**
 * Send trial opportunity notification SMS
 * @param {string} phone - Phone number (with country code)
 * @param {string} firstName - User first name
 * @param {string} opportunity - Trial opportunity details
 * @returns {Promise<object>} - SMS send result
 */
export const sendTrialOpportunitySMS = async (
  phone,
  firstName,
  opportunity,
) => {
  try {
    let formattedPhone = phone;
    if (!phone.startsWith("+")) {
      formattedPhone = `+${phone}`;
    }

    const message = await client.messages.create({
      body: `Hi ${firstName}, great news! You have a new trial opportunity: ${opportunity}. Log in to your account to learn more.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedPhone,
    });

    console.log("Trial opportunity SMS sent successfully:", message.sid);
    return {
      success: true,
      messageSid: message.sid,
      to: formattedPhone,
    };
  } catch (error) {
    console.error("Error sending trial opportunity SMS:", error.message);
    throw new Error(`Failed to send trial opportunity SMS: ${error.message}`);
  }
};
