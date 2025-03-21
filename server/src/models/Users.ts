import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
  taskID: number
  taskTitle: string;
  taskDesc: string;
  taskComplexityPoint: number;
  taskCompletionState: number;
  dateDeadline?: Date;
  aiPrioritizedID: number | null;
  reasonForPrioritizationID: string | null;
}

export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  tasks: ITask[];
}

const TaskSchema = new Schema<ITask>({
    taskID: { type: Number, unique: true },
    taskTitle: { type: String },
    taskDesc: { type: String },
    taskComplexityPoint: { type: Number },
    taskCompletionState: { type: Number, default: 100 },
    dateDeadline: { type: Date },
    aiPrioritizedID: { type: Number, default: null },
    reasonForPrioritizationID: { type: String, default: null },
  },
  { _id: false, timestamps: true } // Disable _id for subdocuments
);

const UserSchema = new Schema<IUser>({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  tasks: { type: [TaskSchema], default: [] }, // Array of embedded tasks
});

export default mongoose.model<IUser>("User", UserSchema);
