import mongoose, { Schema, Document } from "mongoose";
import { ITask, TaskSchema } from "./Task";

export interface IProject extends Document {
  projectTitle: string;
  projectDesc: string;
  projectComplexityPoint: number;
  projectCompletionState: string;
  projectDeadline?: Date;
  projectTasks: ITask[];
}

export enum ProjectCompletionState {
    YetToPickUp = "Yet To Pick Up",
    PikedUp = "Piked Up",
    InImplementation = "In Implementation Phase",
    InTesting = "In Testing Phase",
    Finished = "Finished"

}


const ProjectSchema = new Schema<IProject>(
  {
    projectTitle: { type: String, required: true },
    projectDesc: { type: String, required: true },
    projectComplexityPoint: { type: Number, required: true },
    projectCompletionState: { type: String, default:  ProjectCompletionState.YetToPickUp },
    projectDeadline: { type: Date },
    projectTasks: { type: [TaskSchema], default: [] },
  },
  { timestamps: true }
);

const Project = mongoose.model<IProject>("Project", ProjectSchema); // Export as a model

export { ProjectSchema, Project }; // Export both schema and model
