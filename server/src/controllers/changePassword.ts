import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/Users";

const changePasswordController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, currentPassword, newPassword } = req.body;

    if (!email || !currentPassword || !newPassword) {
      res.status(400).json({ message: "Email, current password, and new password are required." });
      return;
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Current password is incorrect." });
      return;
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully." });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export default changePasswordController;
