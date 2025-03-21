import { Request, Response } from "express";
import User from "../models/Users";
import mongoose from "mongoose";

const createTaskController = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log("Request Body:", req.body);
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
      console.log(email, taskTitle, taskDesc, taskComplexityPoint, taskCompletionState, dateDeadline)

    if (
      !email ||
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
      console.log(user);

    // Determine new task number
    // const lastTask =
    //   user.tasks.length > 0 ? user.tasks[user.tasks.length - 1] : null;

    // Create a new task using Mongoose's built-in subdocument constructor
    const newTask = new (user.tasks as any).constructor({
      taskTitle,
      taskDesc,
      taskComplexityPoint,
      taskCompletionState,
      dateDeadline,
      //   aiPrioritizedID: null, // Cannot be set at creation
      //   reasonForPrioritizationID: null, // Cannot be set at creation
    });

      // Add the new task to the user's task array
      console.log(newTask)
    user.tasks.push(newTask);
    await user.save();

    res
      .status(201)
      .json({ message: "Task created successfully", task: newTask });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default createTaskController;
