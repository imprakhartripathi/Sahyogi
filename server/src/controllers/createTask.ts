import { Request, Response, NextFunction } from "express";
import Task, { ITask } from '../models/Task'
import User from "../models/Users";

const createTaskController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      userEmail,
      taskTitle,
      taskDesc,
      taskComplexityPoint,
      dateDeadline,
    } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email: userEmail });
    if (!userExists) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Get the next task number for this user
    const lastTask = await Task.findOne({ userEmail }).sort({ taskNumber: -1 });
    const taskNumber = lastTask ? lastTask.taskNumber + 1 : 1;

    // Create the new task
    const newTask: ITask = new Task({
      taskNumber,
      userEmail,
      taskTitle,
      taskDesc,
      taskComplexityPoint,
      isDone: false,
      dateCreatedOn: new Date(),
      dateDeadline,
      aiPrioritizedID: null,
    });

    await newTask.save();

    res
      .status(201)
      .json({ message: "Task created successfully", task: newTask });
  } catch (error) {
    next(error);
  }
};

export default createTaskController;
