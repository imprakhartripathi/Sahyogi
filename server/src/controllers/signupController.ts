import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/Users";
import { SECRET_KEY } from "./jsonWebToken-Config";

const signupController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { fullName, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new user
    const newUser: IUser = new User({ fullName, email, password: hashedPassword });
    await newUser.save();
    console.log(newUser)

    // Generate a JWT token
    const token = jwt.sign({ email }, SECRET_KEY);

    res.status(201).json({ token });
  } catch (error) {
    next(error); // Pass the error to the global error handler
  }
};

export default signupController;
