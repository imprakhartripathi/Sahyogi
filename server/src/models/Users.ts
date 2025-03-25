import mongoose, { Schema, Document } from "mongoose";
import { ITask, TaskSchema } from "./Task";
import { IProject, ProjectSchema } from "./Project";

export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;

  imageURL: string;
  contactNumber: number;
  sex: string;
  bio: string;
  orgName: string;
  orgRole: string;

  tasks: ITask[];
  projects: IProject[];
}

const UserSchema = new Schema<IUser>({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },

  tasks: { type: [TaskSchema], default: [] },
  projects: { type: [ProjectSchema], default: [] },

  imageURL: { type: String, default: null },
  contactNumber: { type: Number, default: null },
  sex: { type: String, default: null },
  bio: { type: String, default: null },
  orgName: { type: String, default: null },
  orgRole: { type: String, default: null },
});

export default mongoose.model<IUser>("User", UserSchema);