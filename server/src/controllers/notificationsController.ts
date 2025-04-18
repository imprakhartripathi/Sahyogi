import User from "../models/Users";
import {
  INotification,
  Notification,
  NotificationType,
} from "../models/Notifications";
import { Request, Response } from "express";

// Create notification helper function
export const createNotification = async (
  userEmail: string,
  title: string,
  desc: string,
  type: NotificationType
) => {
  try {
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      throw new Error("User not found for email: " + userEmail);
    }

    if (user.notificationsOn) {
      const newNotification = new Notification({
        title,
        desc,
        type,
        isRead: false,
      });

      user.notifications.push(newNotification);
      await user.save();

      console.log(`Notification created for ${userEmail}: ${title}`);
    }
  } catch (error) {
    console.error("Failed to create notification:", error);
  }
};

// GET all notifications using req.query
export const getNotificationsByEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email } = req.query;

  if (typeof email !== "string") {
    res.status(400).json({ message: "Invalid or missing email in query" });
    return;
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ notifications: user.notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateNotificationReadState = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, notificationId } = req.query;
  const { isRead } = req.body;

  if (typeof email !== "string" || typeof notificationId !== "string") {
    res.status(400).json({ message: "Invalid or missing query parameters" });
    return;
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const notification = (user.notifications as INotification[]).find(
      (notif) => notif._id?.toString() === notificationId
    );

    if (!notification) {
      res.status(404).json({ message: "Notification not found" });
      return;
    }

    notification.isRead = isRead;
    await user.save();

    res
      .status(200)
      .json({ message: "Notification state updated", notification });
  } catch (error) {
    console.error("Error updating notification state:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
