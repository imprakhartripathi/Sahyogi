import { Request, Response } from "express";
import User from "../models/Users";

const editTaskController = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log("Request Body:", req.body);

  try {
    const { email, taskId, updates } = req.body as {
      email: string;
      taskId: string;
      updates: Partial<{
        taskTitle: string;
        taskDesc: string;
        taskComplexityPoint: number;
        taskCompletionState: number;
        dateDeadline?: Date;
        aiPrioritizedID?: number | null;
        reasonForPrioritizationID?: string | null;
      }>;
    };

    console.log("Email:", email, "Task ID:", taskId, "Updates:", updates);

    // Validate required fields
    if (!email || !taskId || !updates || Object.keys(updates).length === 0) {
      res
        .status(400)
        .json({ message: "Email, task ID, and valid updates are required" });
      return;
    }

    // Prevent changing restricted fields
    const restrictedFields = ["taskNumber"]; // Removed aiPrioritizedID & reasonForPrioritizationID
    for (const field of restrictedFields) {
      if (updates.hasOwnProperty(field)) {
        res
          .status(400)
          .json({ message: `Cannot update restricted field: ${field}` });
        return;
      }
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Find the task using `_id.toString()`
    const task = user.tasks.find((task) => task._id?.toString() === taskId);

    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    // Apply updates
    Object.assign(task, updates);
    await user.save();

    console.log("Updated Task:", task);
    res.status(200).json({ message: "Task updated successfully", task });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default editTaskController;
