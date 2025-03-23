import { Request, Response } from "express";
import User from "../models/Users";

const deleteProjectController = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log("Request Body:", req.body);

  try {
    const { email, projectId } = req.body as {
      email: string;
      projectId: string;
    };
    console.log("Email - ", email, "Project ID - ", projectId);

    if (!email || !projectId) {
      res.status(400).json({ message: "Missing required fields - 400" });
      return;
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ message: "User not found - 404" });
      return;
    }

    console.log("User Found - ", user);

    const projectIndex = user.projects.findIndex(
      (proj) => proj._id?.toString() === projectId
    );

    if (projectIndex === -1) {
      res.status(404).json({ message: "Project not found - 404" });
      return;
    }

    console.log("Deleting Project - ", user.projects[projectIndex]);

    user.projects.splice(projectIndex, 1); // Remove project
    await user.save();

    res.status(200).json({ message: "Project deleted successfully - 200" });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ message: "Internal server error - 500" });
  }
};

export default deleteProjectController;
