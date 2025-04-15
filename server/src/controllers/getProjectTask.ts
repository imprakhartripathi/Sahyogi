import { Request, Response } from "express";
import User from "../models/Users";

// Sends tasks of a specific project for a given user (by email and projectId)
const getProjectTasksController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, projectId } = req.query;

    if (!email || !projectId) {
      res.status(400).json({ message: "Email and Project ID are required" });
      return;
    }

    const emailString = Array.isArray(email) ? email[0] : email;
    const projectIdString = Array.isArray(projectId) ? projectId[0] : projectId;

    const user = await User.findOne({ email: emailString }).select("-password");

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const project = user.projects.find(
      (proj) => String(proj._id) === projectIdString
    );

    if (!project) {
      res.status(404).json({ message: "Project not found" });
      return;
    }

    const tasks = project.projectTasks;

    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default getProjectTasksController;
