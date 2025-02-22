import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/Users";
import { SECRET_KEY } from "./jsonWebToken-Config";

const loginController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

    res.status(200).json({ token });
  } catch (error) {
    next(error); // Pass the error to the global error handler
  }
};

export default loginController;
