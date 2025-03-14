import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
  taskNumber: number;
  userEmail: string; // Foreign key linking to User email
  taskTitle: string;
  taskDesc: string;
  taskComplexityPoint: number;
  isDone: boolean;
  dateCreatedOn: Date;
  dateDeadline?: Date;
  dateModified?: Date;
  aiPrioritizedID: string | null;
}

const TaskSchema = new Schema<ITask>({
  taskNumber: { type: Number, required: true },
  userEmail: { type: String, required: true, ref: "User" }, // Foreign key reference
  taskTitle: { type: String, required: true },
  taskDesc: { type: String, required: true },
  taskComplexityPoint: { type: Number, required: true },
  isDone: { type: Boolean, default: false },
  dateCreatedOn: {
    type: Date,
    required: true,
    immutable: true,
    default: Date.now,
  },
  dateDeadline: { type: Date },
  dateModified: { type: Date },
  aiPrioritizedID: { type: String, default: null },
});

export default mongoose.model<ITask>("Task", TaskSchema);
