// import mongoose, { Schema, Document } from "mongoose";

// export interface ITask extends Document {
//   taskNumber: number;
//   userEmail: string; // Foreign key linking to User email
//   taskTitle: string;
//   taskDesc: string;
//   taskComplexityPoint: number;
//   taskCompletionState: number;
//   dateDeadline?: Date;
//   aiPrioritizedID: string | null;
// }

// // Enum for task completion states
// enum TaskState {
//   ToDo = 100,
//   InProgress = 200,
//   Done = 300,
// }

// // Define Mongoose schema
// const TaskSchema = new Schema<ITask>(
//   {
//     taskNumber: { type: Number, required: true, unique: true }, // Ensure unique task numbers
//     userEmail: { type: String, required: true, ref: "User", index: true }, // Foreign key reference with indexing
//     taskTitle: { type: String, required: true },
//     taskDesc: { type: String, required: true },
//     taskComplexityPoint: { type: Number, required: true },
//     taskCompletionState: {
//       type: Number,
//       enum: Object.values(TaskState), // Restricts to valid enum values
//       default: TaskState.ToDo,
//     },
//     dateDeadline: { type: Date },
//     aiPrioritizedID: { type: String, default: null },
//   },
//   { timestamps: true } // Adds createdAt and updatedAt automatically
// );

// // Create and export the model
// export default mongoose.model<ITask>("Task", TaskSchema);
