import User from "../models/User.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import sendEmail from "../utils/sendEmail.js";

//  Generate Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

//  REGISTER
export const registerUser = async (req, res) => {
  const { name, email, password, adminSecret } = req.body;

  try {
    // validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    // check existing user
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // role logic
    let role = "user";
    if (adminSecret && adminSecret === process.env.ADMIN_SECRET) {
      role = "admin";
    }

    // create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role,
    });

    // response (IMPORTANT FORMAT 🔥)
    res.status(201).json({
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: error.message });
  }
};

//  LOGIN
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // validation
    if (!email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    // find user
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // match password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // success response
    res.json({
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: error.message });
  }
};

//  UPDATE USER
export const updateUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await User.findById(req.user.id).select("+password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // email update
    if (email && email !== user.email) {
      const exists = await User.findOne({ email });
      if (exists) {
        return res.status(400).json({ message: "Email already in use" });
      }
      user.email = email.toLowerCase();
    }

    // name update
    if (name) user.name = name;

    // password update
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ message: "Password too short" });
      }
      user.password = password;
    }

    await user.save();

    res.json({
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// LOGOUT (optional)
export const logoutUser = (req, res) => {
  res.json({ message: "Logout successful" });
};

// SEND OTP
export const forgotPassword = async (req, res) => {
  try {
    let { email } = req.body;

    email = email.trim().toLowerCase();

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // GENERATE OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // HASH OTP
    const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

    console.log("REAL OTP:", otp);

    console.log("HASH OTP:", hashedOTP);

    // SAVE IN DB
    user.resetOTP = hashedOTP;

    user.resetOTPExpire = new Date(Date.now() + 10 * 60 * 1000);

    user.isOTPVerified = false;

    // IMPORTANT
    await user.save({ validateBeforeSave: false });

    // CHECK UPDATED USER
    const updatedUser = await User.findOne({
      email,
    });

    console.log("UPDATED USER:", updatedUser.resetOTP);

    // SEND EMAIL
    await sendEmail(
      email,
      "Password Reset OTP",
      `Your OTP is ${otp}. It will expire in 10 minutes.`,
    );

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.log("FORGOT ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// verifyOTP
export const verifyOTP = async (req, res) => {
  try {
    let { email, otp } = req.body;

    email = email.trim().toLowerCase();

    otp = otp.toString().trim();

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // HASH ENTERED OTP
    const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

    console.log("ENTERED OTP:", otp);

    console.log("HASHED OTP:", hashedOTP);

    console.log("DB OTP:", user.resetOTP);

    // CHECK OTP
    if (user.resetOTP !== hashedOTP) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // CHECK EXPIRY
    if (user.resetOTPExpire < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    user.isOTPVerified = true;

    await user.save();

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// reset password
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({
      email,
    }).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // HASH OTP
    const hashedOTP = crypto
      .createHash("sha256")
      .update(otp.toString())
      .digest("hex");

    // CHECK OTP
    if (user.resetOTP !== hashedOTP) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // CHECK EXPIRY
    if (user.resetOTPExpire < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    // SAVE NEW PASSWORD
    user.password = newPassword;

    // CLEAR OTP
    user.resetOTP = undefined;

    user.resetOTPExpire = undefined;

    user.isOTPVerified = false;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// resend otp
export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Cooldown: allow resend after 60 sec
    const currentTime = Date.now();

    if (user.otpResendTime && currentTime < user.otpResendTime) {
      return res.status(429).json({
        success: false,
        message: "Please wait before requesting OTP again",
      });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash OTP
    const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

    // Save
    user.resetOTP = hashedOTP;

    user.resetOTPExpire = Date.now() + 10 * 60 * 1000;

    // resend cooldown
    user.otpResendTime = Date.now() + 60 * 1000;

    await user.save();

    // Send Email
    await sendEmail(
      email,
      "Resend Password Reset OTP",
      `Your new OTP is ${otp}. It will expire in 10 minutes.`,
    );

    res.status(200).json({
      success: true,
      message: "OTP resent successfully",
    });
  } catch (error) {
    console.log("Resend OTP Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// chnage password admin and users both

export const ChangePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const user = await User.findById(req.user.id).select("+password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        message: "New password cannot be same as old password",
      });
    }

    user.password = newPassword;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.log("Change Password Error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};
