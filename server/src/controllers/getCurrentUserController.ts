import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "./jsonWebToken-Config";

const getCurrentUserController = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "No token provided" });
      return;
    }

    const decoded = jwt.verify(token, SECRET_KEY);
    res.json(decoded); // Send the decoded user details
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export default getCurrentUserController;
