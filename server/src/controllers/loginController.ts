import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/Users";
import { SECRET_KEY } from "./jsonWebToken-Config";
import { createEmailNotification } from "./notifyByEmail";
import { NotificationType } from "../models/Notifications";

const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find the user in the database
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    // Generate a JWT token
    const token = jwt.sign({ email }, SECRET_KEY);

    // Get current login timestamp
    const loginTime = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

    // Send email notification
    await createEmailNotification(
      email,
      `New Login Instance Created`,
      `You just logged in on a device on **${loginTime}**.`,
      NotificationType.System
    );

    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
};

export default loginController;
