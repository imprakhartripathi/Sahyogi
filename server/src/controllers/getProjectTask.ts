import { Request, Response } from "express";
import User from "../models/Users";
//sends user info to the frontend using the email
const getProjectTasksController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ message: "Email is required" });
      return;
    }

    const user = await User.findOne({ email }).select("-password");

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Extract all tasks from all projects
    const allTasks = user.projects.flatMap((project) => project.projectTasks);

    res.json(allTasks);
  } catch (error) {
    console.error("Error fetching Tasks:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export default getProjectTasksController;
