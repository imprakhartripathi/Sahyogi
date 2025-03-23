import { Request, Response } from "express";
import User from "../models/Users";

const editProjectController = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log("Request Body:", req.body);

  try {
    const { email, projectId, updates } = req.body as {
      email: string;
      projectId: string;
      updates: Partial<{
        projectTitle: string;
        projectDesc: string;
        projectComplexityPoint: number;
        projectCompletionState: number;
        projectDeadline?: Date;
        projectTasks?: object[];
      }>;
    };

    console.log("Email:", email, "Project ID:", projectId, "Updates:", updates);

    // Validate required fields
    if (!email || !projectId || !updates || Object.keys(updates).length === 0) {
      res
        .status(400)
        .json({ message: "Email, project ID, and valid updates are required" });
      return;
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Find the project using `_id.toString()`
    const project = user.projects.find(
      (proj) => proj._id?.toString() === projectId
    );

    if (!project) {
      res.status(404).json({ message: "Project not found" });
      return;
    }

    // Prevent updating `_id`
    if ("_id" in updates) {
      res.status(400).json({ message: "Cannot update project ID" });
      return;
    }

    // Apply updates
    Object.assign(project, updates);
    await user.save();

    console.log("Updated Project:", project);
    res.status(200).json({ message: "Project updated successfully", project });
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default editProjectController;
