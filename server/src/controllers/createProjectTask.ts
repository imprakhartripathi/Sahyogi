import { Request, Response } from "express";
import User from "../models/Users";
import { ITask, Task } from "../models/Task";
import { createNotification } from "./notificationsController";
import { createEmailNotification } from "./notifyByEmail";
import { NotificationType } from "../models/Notifications";

const createProjectTaskController = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log("Request Body:", req.body);
  try {
    const {
      email,
      projectId,
      taskTitle,
      taskDesc,
      taskComplexityPoint,
      taskCompletionState,
      dateDeadline,
    } = req.body as {
      email: string;
      projectId: string;
      taskTitle: string;
      taskDesc: string;
      taskComplexityPoint: number;
      taskCompletionState: number;
      dateDeadline?: Date;
    };

    if (
      !email ||
      !projectId ||
      !taskTitle ||
      !taskDesc ||
      !taskComplexityPoint ||
      !taskCompletionState
    ) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    console.log("User Found -", user);

    // Correctly find the project by casting _id to a string
    const project = user.projects.find(
      (proj) => String(proj._id) === projectId
    );

    if (!project) {
      res.status(404).json({ message: "Project not found" });
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

    console.log("New Created Task - ", newTask);
    project.projectTasks.push(newTask); // Add the task to the specific project
    await user.save();

    // 🔔 Create a notification after saving the task
        await createNotification(
          email,
          "New Project Task Created",
          `Task "${taskTitle}" has been added to your Project ${project.projectTitle}.`,
          NotificationType.Task
        );
    
        await createEmailNotification(
          email,
          `New Project Task Created: ${taskTitle} in Project: ${project.projectTitle}`,
          `You Created a New Task, "${taskTitle} - ${taskDesc}" with complexity ${taskComplexityPoint}, due on ${dateDeadline}`,
          NotificationType.ProjectTask // or "info", "update", etc. depending on your NotificationType enum
        );

    res
      .status(201)
      .json({ message: "Task created successfully", task: newTask });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default createProjectTaskController;
