import { Request, Response } from "express";
import User from "../models/Users";

const editProjectTaskController = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log("Request Body:", req.body);

  try {
    const { email, projectId, taskId, updates } = req.body as {
      email: string;
      projectId: string;
      taskId: string;
      updates: Partial<{
        taskTitle: string;
        taskDesc: string;
        taskComplexityPoint: number;
        taskCompletionState: number;
        dateDeadline?: Date;
      }>;
    };

    console.log(
      "Email:",
      email,
      "Project ID:",
      projectId,
      "Task ID:",
      taskId,
      "Updates:",
      updates
    );

    if (
      !email ||
      !projectId ||
      !taskId ||
      !updates ||
      Object.keys(updates).length === 0
    ) {
      res
        .status(400)
        .json({
          message: "Email, project ID, task ID, and valid updates are required",
        });
      return;
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Find the project
    const project = user.projects.find(
      (proj) => proj._id?.toString() === projectId
    );

    if (!project) {
      res.status(404).json({ message: "Project not found" });
      return;
    }

    // Find the task inside the project
    const task = project.projectTasks.find(
      (task) => task._id?.toString() === taskId
    );

    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    // Apply updates
    Object.assign(task, updates);
    await user.save();

    console.log("Updated Project Task:", task);
    res
      .status(200)
      .json({ message: "Project task updated successfully", task });
  } catch (error) {
    console.error("Error updating project task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default editProjectTaskController;
