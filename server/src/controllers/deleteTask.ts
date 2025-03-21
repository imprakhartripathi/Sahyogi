import { Request, Response } from "express";
import User from "../models/Users";
import mongoose from "mongoose";

const deleteTaskController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, taskId } = req.body as { email: string; taskId: string };

    if (!email || !taskId) {
      res.status(400).json({ message: "Email and task ID are required" });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      res.status(400).json({ message: "Invalid task ID format" });
      return;
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const taskIndex = user.tasks.findIndex(
      (task) => task._id?.toString() === taskId
    );

    if (taskIndex === -1) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    user.tasks.splice(taskIndex, 1); // Remove task
    await user.save();

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default deleteTaskController;
