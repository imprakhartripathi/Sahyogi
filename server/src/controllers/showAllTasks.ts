// import { Request, Response, NextFunction } from "express";
// import Task from "../models/Task";

// const showAllTasksController = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const { userEmail } = req.params;

//     if (!userEmail) {
//       res.status(400).json({ message: "User email is required" });
//       return;
//     }

//     const tasks = await Task.find({ userEmail }).sort({ taskNumber: 1 }).lean();

//     if (tasks.length === 0) {
//       res.status(404).json({ message: "No tasks found for this user" });
//       return;
//     }

//     res.status(200).json({ tasks });
//   } catch (error) {
//     next(error);
//   }
// };

// export default showAllTasksController;
