import { ITask, TaskCompletionState } from "../models/Task";
import User from "../models/Users";
import { createNotification } from "./notificationsController";
import { NotificationType } from "../models/Notifications";
import { createEmailNotification } from "./notifyByEmail";

const deadlineNotificationController = async (): Promise<void> => {
  try {
    console.log("Running deadline notification check...");
    const currentDate = new Date();
    
    // Calculate 5 days from now
    const fiveDaysFromNow = new Date(currentDate);
    fiveDaysFromNow.setDate(fiveDaysFromNow.getDate() + 5);
    
    // Find all users with tasks and only select necessary fields
    const users = await User.find({})
      .select("email tasks notificationsOn emailNotificationsOn");
    
    for (const user of users) {
      // Skip if user has disabled notifications
      if (!user.notificationsOn && !user.emailNotificationsOn) continue;
      
      const tasksApproachingDeadline: ITask[] = user.tasks.filter(task => {
        // Skip completed tasks (assuming 300 is your "Done" status)
        if (task.taskCompletionState === TaskCompletionState.Done) return false;
        
        // Skip tasks without deadlines
        if (!task.dateDeadline) return false;
        
        // Check if deadline is within the next 5 days
        const deadline = new Date(task.dateDeadline);
        return deadline <= fiveDaysFromNow && deadline >= currentDate;
      });
      
      // Send notifications for each approaching task
      for (const task of tasksApproachingDeadline) {
        const daysLeft = Math.ceil(
          (new Date(task.dateDeadline!).getTime() - currentDate.getTime()) / 
          (1000 * 60 * 60 * 24)
        );
        
        // Only send in-app notification if enabled
        if (user.notificationsOn) {
          await createNotification(
            user.email,
            "Deadline Approaching",
            `Task "${task.taskTitle}" is due in ${daysLeft} day(s)`,
            NotificationType.System
          );
        }
        
        // Only send email notification if enabled
        if (user.emailNotificationsOn) {
          await createEmailNotification(
            user.email,
            `Deadline Reminder: "${task.taskTitle}" due in ${daysLeft} day(s)`,
            `Your task "${task.taskTitle}" is due on ${task.dateDeadline?.toLocaleDateString()}. 
            Description: ${task.taskDesc}
            Complexity: ${task.taskComplexityPoint}
            Current status: ${getStatusText(task.taskCompletionState)}`,
            NotificationType.System
          );
        }
      }
    }
    
    console.log("Deadline notification check completed.");
  } catch (error) {
    console.error("Error in deadline notification controller:", error);
  }
};

// Helper function to get status text
function getStatusText(status: number): string {
  switch(status) {
    case TaskCompletionState.ToDo: return "To Do";
    case TaskCompletionState.InProgress: return "In Progress";
    case TaskCompletionState.Done: return "Done";
    default: return "Unknown";
  }
}

export default deadlineNotificationController;