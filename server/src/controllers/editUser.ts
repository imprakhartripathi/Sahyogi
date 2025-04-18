import { Request, Response } from "express";
import User, { IUser } from "../models/Users"; // Make sure to import IUser interface

const editUserController = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log("Request Body:", req.body);

  try {
    const { email, updates } = req.body as {
      email: string;
      updates: Partial<IUser>;
    };

    console.log("Email:", email, "Updates:", updates);

    if (!email) {
      res.status(400).json({ message: "Email is required" });
      return;
    }

    if (!updates || Object.keys(updates).length === 0) {
      res.status(400).json({ message: "Valid updates are required" });
      return;
    }

    // Prevent changing restricted fields
    const restrictedFields = ["email", "_id", "__v"] as const;
    for (const field of restrictedFields) {
      if (field in updates) {
        res.status(400).json({ 
          message: `Cannot update restricted field: ${field}` 
        });
        return;
      }
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Apply updates to only allowed fields
    const allowedFields: Array<keyof IUser> = [
      'fullName',
      'contactNumber',
      'sex',
      'bio',
      'orgName',
      'orgRole',
      'imageURL',
      'notificationsOn',
      'emailNotificationsOn',
      'userSetTheme'
    ];

    for (const field of allowedFields) {
      if (field in updates && updates[field] !== undefined) {
        (user as any)[field] = updates[field];
      }
    }

    const updatedUser = await user.save();

    console.log("Updated User:", updatedUser);
    res.status(200).json({ 
      message: "User updated successfully", 
      user: updatedUser.toObject() 
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default editUserController;