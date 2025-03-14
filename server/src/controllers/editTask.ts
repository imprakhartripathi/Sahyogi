import { Request, Response, NextFunction } from "express";
import Task from "../models/Task";

const editTaskController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userEmail, taskNumber } = req.params;
    const { taskTitle, taskDesc, taskComplexityPoint, isDone, dateDeadline } =
      req.body;

    const task = await Task.findOne({ userEmail, taskNumber });

    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    // Update fields if provided
    if (taskTitle) task.taskTitle = taskTitle;
    if (taskDesc) task.taskDesc = taskDesc;
    if (taskComplexityPoint !== undefined)
      task.taskComplexityPoint = taskComplexityPoint;
    if (isDone !== undefined) task.isDone = isDone;
    if (dateDeadline) task.dateDeadline = dateDeadline;

    task.dateModified = new Date();

    await task.save();

    res.status(200).json({ message: "Task updated successfully", task });
  } catch (error) {
    next(error);
  }
};

export default editTaskController;
