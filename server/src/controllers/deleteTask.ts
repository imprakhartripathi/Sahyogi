import { Request, Response } from "express";
import User from "../models/Users";

const deleteTaskController = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log("Request Body:", req.body);

  try {
    const { email, taskId } = req.body as { email: string; taskId: string };
    console.log("Email - ", email, "Task ID - ", taskId);

    if (!email || !taskId) {
      res.status(400).json({ message: "Missing required fields - 400" });
      return;
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ message: "User not found - 404" });
      return;
    }

    console.log("User Found - ", user);

    const taskIndex = user.tasks.findIndex(
      (task) => task._id?.toString() === taskId
    );

    if (taskIndex === -1) {
      res.status(404).json({ message: "Task not found - 404" });
      return;
    }

    console.log("Deleting Task - ", user.tasks[taskIndex]);

    user.tasks.splice(taskIndex, 1); // Remove task
    await user.save();

    res.status(200).json({ message: "Task deleted successfully - 200" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Internal server error - 500" });
  }
};

export default deleteTaskController;
