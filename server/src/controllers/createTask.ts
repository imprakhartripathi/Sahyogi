import { Request, Response } from "express";
import User from "../models/Users";
import { ITask, Task } from "../models/Task";
import { createNotification } from "./notificationsController";
import { NotificationType } from "../models/Notifications";
import { createEmailNotification } from "./notifyByEmail";

const createTaskController = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      email,
      taskTitle,
      taskDesc,
      taskComplexityPoint,
      taskCompletionState,
      dateDeadline,
    } = req.body as {
      email: string;
      taskTitle: string;
      taskDesc: string;
      taskComplexityPoint: number;
      taskCompletionState: number;
      dateDeadline?: Date;
    };

    if (!email || !taskTitle || !taskDesc || !taskComplexityPoint || !taskCompletionState) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const newTask: ITask = new Task({
      taskTitle,
      taskDesc,
      taskComplexityPoint,
      taskCompletionState,
      dateDeadline,
      aiPrioritizedID: null,
      reasonForPrioritizationID: null,
    });

    user.tasks.push(newTask);
    await user.save();

    // 🔔 Create a notification after saving the task
    await createNotification(
      email,
      "New Task Assigned",
      `Task ${taskTitle} has been added to your list.`,
      NotificationType.Task
    );

    await createEmailNotification(
      email,
      `New Task Created: ${taskTitle}`,
      `You Created a New Task, "${taskTitle} - ${taskDesc}" with complexity ${taskComplexityPoint}, due on ${dateDeadline}`,
      NotificationType.Task // or "info", "update", etc. depending on your NotificationType enum
    );
    

    res.status(201).json({ message: "Task created successfully", task: newTask });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default createTaskController;
