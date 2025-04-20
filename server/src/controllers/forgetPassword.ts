import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/Users";
import nodemailer from "nodemailer";

// Temporary storage for OTPs (in production, use Redis or database)
const otpStorage: Record<string, { otp: string; expiresAt: number }> = {};

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email service
  auth: {
    user: process.env.MAIL_ID,
    pass: process.env.MAIL_PASS
  }
});

// 1. Check if user exists and initiate password reset
export const initiatePasswordReset = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ message: "Email is required." });
      return;
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    // Proceed to generate and send OTP
    await generateAndSendOtp(email);

    res.status(200).json({ 
      message: "OTP sent to your email if the account exists.",
      // Note: In production, don't reveal whether email exists or not for security
    });
  } catch (error) {
    console.error("Error initiating password reset:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// 2. Generate OTP and send email
const generateAndSendOtp = async (email: string): Promise<void> => {
  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 15 * 60 * 1000; // OTP expires in 15 minutes

  // Store OTP temporarily
  otpStorage[email] = { otp, expiresAt };

  // Send email
  const mailOptions = {
    from: `Sahyogi Password Recovery <${process.env.MAIL_ID}>`,
    to: email,
    subject: 'Password Recovery - OTP',
    text: `Your OTP for password reset is: ${otp}. This OTP is valid for 15 minutes.`
  };

  await transporter.sendMail(mailOptions);
};

// 3. Validate OTP and reset password
export const validateOtpAndResetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      res.status(400).json({ message: "Email, OTP, and new password are required." });
      return;
    }

    // Check if OTP exists and is not expired
    const storedOtpData = otpStorage[email];
    if (!storedOtpData || storedOtpData.expiresAt < Date.now()) {
      res.status(400).json({ message: "OTP is invalid or expired." });
      return;
    }

    // Validate OTP
    if (storedOtpData.otp !== otp) {
      res.status(400).json({ message: "Invalid OTP." });
      return;
    }

    // Find user and update password
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // Clear OTP after successful password reset
    delete otpStorage[email];

    res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Optional: Validate OTP without resetting password (for frontend step 2)
export const validateOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      res.status(400).json({ message: "Email and OTP are required." });
      return;
    }

    const storedOtpData = otpStorage[email];
    if (!storedOtpData || storedOtpData.expiresAt < Date.now()) {
      res.status(400).json({ message: "OTP is invalid or expired." });
      return;
    }

    if (storedOtpData.otp !== otp) {
      res.status(400).json({ message: "Invalid OTP." });
      return;
    }

    res.status(200).json({ message: "OTP validated successfully." });
  } catch (error) {
    console.error("Error validating OTP:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};