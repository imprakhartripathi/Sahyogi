import { Request, Response } from "express";
import User from "../models/Users";

// Gets user tasks using email as a query parameter
const getTasksController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.query; // Now getting email from query params

    if (!email) {
      res.status(400).json({ message: "Email is required" });
      return;
    }

    // Convert email to string since req.query returns string | string[] | undefined
    const emailString = Array.isArray(email) ? email[0] : email;
    
    const user = await User.findOne({ email: emailString }).select("-password");

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json(user.tasks);
  } catch (error) {
    console.error("Error fetching Tasks:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default getTasksController;