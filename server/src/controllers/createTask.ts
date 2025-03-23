import { Request, Response } from "express";
import User from "../models/Users";
import { ITask, Task } from "../models/Task";

const createTaskController = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log("Request Body:", req.body);
  try {
    const { email, taskTitle, taskDesc, taskComplexityPoint, taskCompletionState, dateDeadline } = req.body as { email: string; taskTitle: string; taskDesc: string; taskComplexityPoint: number; taskCompletionState: number; dateDeadline?: Date; };
    console.log("Email - ", email, "Task Title - ", "Task Desc - ", taskDesc, "Task CPoint - ", taskComplexityPoint, "Task Comp State - ", taskCompletionState, "Task Deadline - ", dateDeadline);

    if ( !email || !taskTitle || !taskDesc || !taskComplexityPoint || !taskCompletionState ) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    console.log(user);


    const newTask: ITask = new Task({ taskTitle, taskDesc, taskComplexityPoint, taskCompletionState, dateDeadline, aiPrioritizedID: null, reasonForPrioritizationID: null });

    console.log("New Created Task - ", newTask)
    user.tasks.push(newTask);
    await user.save();

    res.status(201).json({ message: "Task created successfully - 201 ", task: newTask });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default createTaskController;
