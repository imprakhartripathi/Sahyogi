import { Request, Response } from "express";
import User from "../models/Users";

const deleteProjectTaskController = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log("Request Body:", req.body);

  try {
    const { email, projectId, taskId } = req.body as {
      email: string;
      projectId: string;
      taskId: string;
    };

    console.log("Email:", email, "Project ID:", projectId, "Task ID:", taskId);

    if (!email || !projectId || !taskId) {
      res.status(400).json({ message: "Missing required fields - 400" });
      return;
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ message: "User not found - 404" });
      return;
    }

    console.log("User Found:", user);

    const project = user.projects.find(
      (proj) => proj._id?.toString() === projectId
    );

    if (!project) {
      res.status(404).json({ message: "Project not found - 404" });
      return;
    }

    console.log("Project Found:", project);

    const taskIndex = project.projectTasks.findIndex(
      (task) => task._id?.toString() === taskId
    );

    if (taskIndex === -1) {
      res.status(404).json({ message: "Task not found - 404" });
      return;
    }

    console.log("Deleting Task:", project.projectTasks[taskIndex]);

    project.projectTasks.splice(taskIndex, 1); // Remove task
    await user.save();

    res
      .status(200)
      .json({ message: "Project Task deleted successfully - 200" });
  } catch (error) {
    console.error("Error deleting project task:", error);
    res.status(500).json({ message: "Internal server error - 500" });
  }
};

export default deleteProjectTaskController;
