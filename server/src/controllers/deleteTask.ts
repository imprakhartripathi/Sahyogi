import { Request, Response, NextFunction } from "express";
import Task from "../models/Task";

const deleteTaskController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userEmail, taskNumber } = req.params;

    const task = await Task.findOneAndDelete({ userEmail, taskNumber });

    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export default deleteTaskController;
