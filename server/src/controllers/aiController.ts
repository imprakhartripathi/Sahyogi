import { Request, Response } from "express";
import User from "../models/Users";
import { ITask, TaskCompletionState } from "../models/Task";

// Define an extended interface for tasks with priority score
interface IPrioritizedTask extends Omit<ITask, keyof Document> {
  priorityScore?: number;
}

const aiController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.query;

    if (!email) {
      res.status(400).json({ message: "Email is required" });
      return;
    }

    // Convert email to string
    const emailString = Array.isArray(email) ? email[0] : email;
    
    const user = await User.findOne({ email: emailString }).select("-password");

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Get current date for deadline comparison
    const currentDate = new Date();

    // Create an array of plain objects with task data and priority score
    const prioritizedTasks: IPrioritizedTask[] = user.tasks
      .filter(task => task.taskCompletionState !== TaskCompletionState.Done)
      .map(task => {
        const taskObj = task.toObject ? task.toObject() : task;
        const complexityWeight = 0.6;
        const deadlineWeight = 0.4;
        
        // Normalize complexity (assuming max complexity is 10)
        const normalizedComplexity = taskObj.taskComplexityPoint / 10;
        
        // Calculate days until deadline (or 0 if no deadline)
        const daysUntilDeadline = taskObj.dateDeadline 
          ? (taskObj.dateDeadline.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
          : 0;
        
        // Normalize deadline urgency (more urgent = higher score)
        const normalizedDeadline = daysUntilDeadline <= 0 
          ? 1 // Deadline passed or today - highest urgency
          : Math.max(0, 1 - (daysUntilDeadline / 14)); // Linear decay over 14 days
        
        // Calculate priority score
        const priorityScore = (complexityWeight * normalizedComplexity) + 
                            (deadlineWeight * normalizedDeadline);
        
        return {
          ...taskObj,
          priorityScore
        };
      });

    // Sort tasks by priority score (descending)
    prioritizedTasks.sort((a, b) => (b.priorityScore || 0) - (a.priorityScore || 0));

    // Categorize into 3 priority arrays
    const highPriority: IPrioritizedTask[] = [];
    const mediumPriority: IPrioritizedTask[] = [];
    const lowPriority: IPrioritizedTask[] = [];

    // Split tasks into 3 equal parts based on priority score
    const totalTasks = prioritizedTasks.length;
    const highCount = Math.ceil(totalTasks / 3);
    const mediumCount = Math.ceil((totalTasks - highCount) / 2);

    prioritizedTasks.forEach((task, index) => {
      if (index < highCount) {
        highPriority.push(task);
      } else if (index < highCount + mediumCount) {
        mediumPriority.push(task);
      } else {
        lowPriority.push(task);
      }
    });

    // Send the categorized tasks as JSON
    res.json({
      highPriority,
      mediumPriority,
      lowPriority,
      message: "Tasks successfully prioritized based on complexity and deadline"
    });

  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ message: "An error occurred while processing your request." });
  }
};

export default aiController;