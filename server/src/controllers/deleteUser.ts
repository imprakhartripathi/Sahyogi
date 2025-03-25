import { Request, Response } from "express";
import User from "../models/Users";

const deleteUserController = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log("Request Body:", req.body);

  try {
    const { email } = req.body as { email: string };

    console.log("Email:", email);

    if (!email) {
      res.status(400).json({ message: "Email is required" });
      return;
    }

    const user = await User.findOneAndDelete({ email });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    console.log("Deleted User:", user);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default deleteUserController;
