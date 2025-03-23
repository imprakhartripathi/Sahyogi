import mongoose, { Schema, Document } from "mongoose";
import { ITask, TaskSchema } from "./Task"; // Import TaskSchema
import { IProject, ProjectSchema } from "./Project";

export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  tasks: ITask[];
  projects: IProject[];
}

const UserSchema = new Schema<IUser>({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  tasks: { type: [TaskSchema], default: [] }, // Embed TaskSchema here
  projects: { type: [ProjectSchema], default: [] }
});

export default mongoose.model<IUser>("User", UserSchema);