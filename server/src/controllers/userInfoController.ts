import { Request, Response } from "express";
import User from "../models/Users";
//sends user info to the frontend using the email
const userInfoController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body; // Email sent in request body

    if (!email) {
      res.status(400).json({ message: "Email is required" });
      return;
    }

    const user = await User.findOne({ email }).select("-password"); // Exclude password

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default userInfoController;
