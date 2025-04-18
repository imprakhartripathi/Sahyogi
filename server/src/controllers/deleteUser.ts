import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/Users";

const deleteUserController = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log("Request Body:", req.body);

  try {
    const { email, password } = req.body as { email: string; password: string };

    console.log("Email:", email);

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid password" });
      return;
    }

    await User.findOneAndDelete({ email });

    console.log("Deleted User:", user);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default deleteUserController;
