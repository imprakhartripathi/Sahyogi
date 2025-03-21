import { Request, Response } from "express";
import User from "../models/Users";

const editTaskController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, taskId, updates } = req.body;

    if (!email || !taskId || !updates) {
      res
        .status(400)
        .json({ message: "Email, task ID, and updates are required" });
      return;
    }

    // Prevent changing restricted fields
    const restrictedFields = [
      "taskNumber",
      "aiPrioritizedID",
      "reasonForPrioritizationID",
    ];
    for (const field of restrictedFields) {
      if (updates.hasOwnProperty(field)) {
        res.status(400).json({ message: `Cannot update ${field}` });
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

    Object.assign(task, updates); // Apply updates
    await user.save();

    res.json({ message: "Task updated successfully", task });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default editTaskController;
