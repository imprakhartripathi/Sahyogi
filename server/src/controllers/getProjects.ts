import { Request, Response } from "express";
import User from "../models/Users";
//sends projects info to the frontend using the email
const getProjectsController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.query; // Email sent in request

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

    res.json(user.projects);
  } catch (error) {
    console.error("Error fetching Projects:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default getProjectsController;
