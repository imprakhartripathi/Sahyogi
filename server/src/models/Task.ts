import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
  taskTitle: string;
  taskDesc: string;
  taskComplexityPoint: number;
  taskCompletionState: number;
  dateDeadline?: Date;
  aiPrioritizedID: number | null;
  reasonForPrioritizationID: string | null;
}

export enum TaskCompletionState {
  ToDo = 102, // Processing (Task is yet to be started)
  InProgress = 202, // Accepted (Task is currently in progress)
  Done = 200, // OK (Task is completed successfully)
}


const TaskSchema = new Schema<ITask>(
  {
    taskTitle: { type: String, required: true },
    taskDesc: { type: String, required: true },
    taskComplexityPoint: { type: Number, required: true },
    taskCompletionState: { type: Number, default: 100 },
    dateDeadline: { type: Date },
    aiPrioritizedID: { type: Number, default: null },
    reasonForPrioritizationID: { type: String, default: null },
  },
  { timestamps: true }
);

const Task = mongoose.model<ITask>("Task", TaskSchema); // Export as a model

export { TaskSchema, Task }; // Export both schema and model
