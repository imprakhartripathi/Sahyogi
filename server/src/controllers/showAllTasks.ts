import { Request, Response, NextFunction } from "express";
import Task from "../models/Task";

const showAllTasksController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userEmail } = req.params;

    const tasks = await Task.find({ userEmail }).sort({ taskNumber: 1 });

    res.status(200).json({ tasks });
  } catch (error) {
    next(error);
  }
};

export default showAllTasksController;
