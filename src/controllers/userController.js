import { PrismaClient } from "@prisma/client";
import {
  validateInput,
  registerPlayerSchema,
} from "../utils/validationUtils.js";
import { calculateAge } from "../utils/helpers.js";
import {
  sendWelcomeEmail,
  sendLoginConfirmationEmail,
} from "../services/emailService.js";
import {
  sendWelcomeSMS,
  sendLoginGreetingSMS,
} from "../services/smsService.js";

const prisma = new PrismaClient();

/**
 * Register a new player
 */
export const registerPlayer = async (req, res) => {
  try {
    const userId = req.user.userId; // From auth middleware

    // Get user data
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if player already registered
    const existingProfile = await prisma.playerProfile.findUnique({
      where: { userId },
    });

    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: "Player profile already exists",
      });
    }

    // Validate input
    const { error, value } = validateInput(req.body, registerPlayerSchema);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error,
      });
    }

    // Validate district belongs to state
    const district = await prisma.district.findFirst({
      where: {
        id: value.districtId,
        stateId: value.stateId,
      },
    });

    if (!district) {
      return res.status(400).json({
        success: false,
        message: "Selected district does not belong to the selected state",
      });
    }

    // Validate trial district belongs to trial state
    const trialDistrict = await prisma.district.findFirst({
      where: {
        id: value.trialDistrictId,
        stateId: value.trialStateId,
      },
    });

    if (!trialDistrict) {
      return res.status(400).json({
        success: false,
        message:
          "Selected trial district does not belong to the selected trial state",
      });
    }

    // Calculate age
    const dob = new Date(value.dateOfBirth);
    const age = calculateAge(dob);

    // Validate age category
    if (value.ageCategory === "UNDER_16" && age >= 16) {
      return res.status(400).json({
        success: false,
        message: "Age does not match the selected age category",
      });
    }

    if (value.ageCategory === "OPEN_AGE" && age < 16) {
      return res.status(400).json({
        success: false,
        message: "Age does not match the selected age category",
      });
    }

    // Create player profile
    const playerProfile = await prisma.playerProfile.create({
      data: {
        userId,
        firstName: value.firstName,
        lastName: value.lastName,
        fatherName: value.fatherName,
        motherName: value.motherName,
        dateOfBirth: dob,
        ageCategory: value.ageCategory,
        stateId: value.stateId,
        districtId: value.districtId,
        city: value.city,
        playerRole: value.playerRole,
        trialStateId: value.trialStateId,
        trialDistrictId: value.trialDistrictId,
      },
      include: {
        state: true,
        district: true,
        trialState: true,
        trialDistrict: true,
      },
    });

    // Send welcome emails and SMS
    try {
      if (user.email) {
        await sendWelcomeEmail(user.email, value.firstName);
      }
      if (user.phone) {
        await sendWelcomeSMS(user.phone, value.firstName);
      }
    } catch (notificationError) {
      console.error("Error sending notifications:", notificationError.message);
      // Don't fail registration if notifications fail
    }

    return res.status(201).json({
      success: true,
      message: "Player registered successfully",
      data: {
        playerProfile: {
          id: playerProfile.id,
          firstName: playerProfile.firstName,
          lastName: playerProfile.lastName,
          fatherName: playerProfile.fatherName,
          motherName: playerProfile.motherName,
          dateOfBirth: playerProfile.dateOfBirth,
          age,
          ageCategory: playerProfile.ageCategory,
          state: playerProfile.state.name,
          district: playerProfile.district.name,
          city: playerProfile.city,
          playerRole: playerProfile.playerRole,
          trialState: playerProfile.trialState.name,
          trialDistrict: playerProfile.trialDistrict.name,
          createdAt: playerProfile.createdAt,
        },
      },
    });
  } catch (error) {
    console.error("Register player error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to register player",
      error: error.message,
    });
  }
};

/**
 * Get user profile
 */
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId; // From auth middleware

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        playerProfile: {
          include: {
            state: true,
            district: true,
            trialState: true,
            trialDistrict: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const profileData = {
      userId: user.id,
      email: user.email,
      phone: user.phone,
      isEmailVerified: user.isEmailVerified,
      isPhoneVerified: user.isPhoneVerified,
      createdAt: user.createdAt,
    };

    if (user.playerProfile) {
      profileData.playerProfile = {
        id: user.playerProfile.id,
        firstName: user.playerProfile.firstName,
        lastName: user.playerProfile.lastName,
        fatherName: user.playerProfile.fatherName,
        motherName: user.playerProfile.motherName,
        dateOfBirth: user.playerProfile.dateOfBirth,
        age: calculateAge(new Date(user.playerProfile.dateOfBirth)),
        ageCategory: user.playerProfile.ageCategory,
        state: user.playerProfile.state.name,
        stateId: user.playerProfile.stateId,
        district: user.playerProfile.district.name,
        districtId: user.playerProfile.districtId,
        city: user.playerProfile.city,
        playerRole: user.playerProfile.playerRole,
        trialState: user.playerProfile.trialState.name,
        trialStateId: user.playerProfile.trialStateId,
        trialDistrict: user.playerProfile.trialDistrict.name,
        trialDistrictId: user.playerProfile.trialDistrictId,
        createdAt: user.playerProfile.createdAt,
        updatedAt: user.playerProfile.updatedAt,
      };
    }

    return res.status(200).json({
      success: true,
      message: "Profile retrieved successfully",
      data: profileData,
    });
  } catch (error) {
    console.error("Get user profile error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve profile",
      error: error.message,
    });
  }
};

/**
 * Update player profile
 */
export const updatePlayerProfile = async (req, res) => {
  try {
    const userId = req.user.userId; // From auth middleware

    // Get player profile
    const playerProfile = await prisma.playerProfile.findUnique({
      where: { userId },
    });

    if (!playerProfile) {
      return res.status(404).json({
        success: false,
        message: "Player profile not found",
      });
    }

    // Validate input (partial validation)
    const updateData = {};
    const allowedFields = [
      "firstName",
      "lastName",
      "fatherName",
      "motherName",
      "city",
      "playerRole",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field]) {
        updateData[field] = req.body[field];
      }
    });

    // Validate district update if state is being updated
    if (req.body.districtId && req.body.stateId) {
      const district = await prisma.district.findFirst({
        where: {
          id: req.body.districtId,
          stateId: req.body.stateId,
        },
      });

      if (!district) {
        return res.status(400).json({
          success: false,
          message: "Selected district does not belong to the selected state",
        });
      }

      updateData.districtId = req.body.districtId;
      updateData.stateId = req.body.stateId;
    }

    // Update profile
    const updatedProfile = await prisma.playerProfile.update({
      where: { userId },
      data: updateData,
      include: {
        state: true,
        district: true,
        trialState: true,
        trialDistrict: true,
      },
    });

    const user = await prisma.user.findUnique({ where: { id: userId } });

    // Send update notification
    try {
      if (user.email) {
        await sendLoginConfirmationEmail(
          user.email,
          updatedProfile.firstName,
          new Date().toISOString(),
        );
      }
    } catch (notificationError) {
      console.error("Error sending notification:", notificationError.message);
    }

    return res.status(200).json({
      success: true,
      message: "Player profile updated successfully",
      data: {
        playerProfile: {
          id: updatedProfile.id,
          firstName: updatedProfile.firstName,
          lastName: updatedProfile.lastName,
          fatherName: updatedProfile.fatherName,
          motherName: updatedProfile.motherName,
          dateOfBirth: updatedProfile.dateOfBirth,
          age: calculateAge(new Date(updatedProfile.dateOfBirth)),
          ageCategory: updatedProfile.ageCategory,
          state: updatedProfile.state.name,
          stateId: updatedProfile.stateId,
          district: updatedProfile.district.name,
          districtId: updatedProfile.districtId,
          city: updatedProfile.city,
          playerRole: updatedProfile.playerRole,
          trialState: updatedProfile.trialState.name,
          trialStateId: updatedProfile.trialStateId,
          trialDistrict: updatedProfile.trialDistrict.name,
          trialDistrictId: updatedProfile.trialDistrictId,
          createdAt: updatedProfile.createdAt,
          updatedAt: updatedProfile.updatedAt,
        },
      },
    });
  } catch (error) {
    console.error("Update player profile error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to update player profile",
      error: error.message,
    });
  }
};

/**
 * Get all states
 */
export const getStates = async (req, res) => {
  try {
    const states = await prisma.state.findMany({
      select: {
        id: true,
        name: true,
        code: true,
      },
      orderBy: { name: "asc" },
    });

    return res.status(200).json({
      success: true,
      message: "States retrieved successfully",
      data: { states },
    });
  } catch (error) {
    console.error("Get states error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve states",
      error: error.message,
    });
  }
};

/**
 * Get districts by state
 */
export const getDistricts = async (req, res) => {
  try {
    const { stateId } = req.params;

    if (!stateId) {
      return res.status(400).json({
        success: false,
        message: "State ID is required",
      });
    }

    const districts = await prisma.district.findMany({
      where: { stateId },
      select: {
        id: true,
        name: true,
        code: true,
      },
      orderBy: { name: "asc" },
    });

    return res.status(200).json({
      success: true,
      message: "Districts retrieved successfully",
      data: { districts },
    });
  } catch (error) {
    console.error("Get districts error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve districts",
      error: error.message,
    });
  }
};
