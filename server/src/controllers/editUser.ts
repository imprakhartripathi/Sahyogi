import { Request, Response } from "express";
import User from "../models/Users";

const editUserController = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log("Request Body:", req.body);

  try {
    const { email, updates } = req.body as {
      email: string;
      updates: Partial<{
        fullName: string;
        password: string;
        imageURL: string;
        contactNumber: number;
        sex: string;
        bio: string;
        orgName: string;
        orgRole: string;
      }>;
    };

    console.log("Email:", email, "Updates:", updates);

    if (!email || !updates || Object.keys(updates).length === 0) {
      res.status(400).json({ message: "Email and valid updates are required" });
      return;
    }

    // Prevent changing restricted fields
    const restrictedFields = ["email"];
    for (const field of restrictedFields) {
      if (updates.hasOwnProperty(field)) {
        res
          .status(400)
          .json({ message: `Cannot update restricted field: ${field}` });
        return;
      }
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Apply updates
    Object.assign(user, updates);
    await user.save();

    console.log("Updated User:", user);
    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default editUserController;
