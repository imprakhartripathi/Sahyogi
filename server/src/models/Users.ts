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

// {
//   "_id": {
//     "$oid": "67da94a127fe2bbbad063137"
//   },
//   "fullName": "Prakhar Tripathi",
//   "email": "shashank.pt098@gmail.com",
//   "password": "$2a$10$zCQYhrqDohgO2fnhyfHfouNLlLfiakxp0HVwE9gxXMc90gjwqeO.e",
//   "tasks": [
//     {
//       "taskNumber": 1,
//       "taskTitle": "Setup Project Repository",
//       "taskDesc": "Initialize a Git repository and set up a basic project structure.",
//       "taskComplexityPoint": 2,
//       "taskCompletionState": 100,
//       "dateDeadline": {
//         "$date": "2025-03-25T00:00:00.000Z"
//       },
//       "aiPrioritizedID": null,
//       "reasonForPrioritizationID": null,
//       "createdAt": {
//         "$date": "2025-03-19T16:22:47.092Z"
//       },
//       "updatedAt": {
//         "$date": "2025-03-19T16:22:47.092Z"
//       }
//     },
//     {
//       "taskNumber": 2,
//       "taskTitle": "Implement User Authentication",
//       "taskDesc": "Create JWT-based authentication using Express and MongoDB.",
//       "taskComplexityPoint": 5,
//       "taskCompletionState": 100,
//       "dateDeadline": {
//         "$date": "2025-03-30T00:00:00.000Z"
//       },
//       "aiPrioritizedID": 1,
//       "reasonForPrioritizationID": "Security is a critical feature.",
//       "createdAt": {
//         "$date": "2025-03-19T16:22:47.093Z"
//       },
//       "updatedAt": {
//         "$date": "2025-03-19T16:22:47.093Z"
//       }
//     },
//     {
//       "taskNumber": 3,
//       "taskTitle": "Design Database Schema",
//       "taskDesc": "Define Mongoose schemas for users and tasks.",
//       "taskComplexityPoint": 3,
//       "taskCompletionState": 200,
//       "dateDeadline": {
//         "$date": "2025-03-28T00:00:00.000Z"
//       },
//       "aiPrioritizedID": 2,
//       "reasonForPrioritizationID": "Needed before implementing CRUD operations.",
//       "createdAt": {
//         "$date": "2025-03-19T16:22:47.093Z"
//       },
//       "updatedAt": {
//         "$date": "2025-03-19T16:22:47.093Z"
//       }
//     },
//     {
//       "taskNumber": 4,
//       "taskTitle": "Integrate Frontend with Backend",
//       "taskDesc": "Connect Angular frontend with Express backend APIs.",
//       "taskComplexityPoint": 4,
//       "taskCompletionState": 100,
//       "dateDeadline": {
//         "$date": "2025-04-05T00:00:00.000Z"
//       },
//       "aiPrioritizedID": null,
//       "reasonForPrioritizationID": null,
//       "createdAt": {
//         "$date": "2025-03-19T16:22:47.093Z"
//       },
//       "updatedAt": {
//         "$date": "2025-03-19T16:22:47.093Z"
//       }
//     },
//     {
//       "taskCompletionState": 100,
//       "createdAt": {
//         "$date": "2025-03-19T16:22:47.094Z"
//       },
//       "updatedAt": {
//         "$date": "2025-03-19T16:22:47.094Z"
//       }
//     },
//     {
//       "taskCompletionState": 100,
//       "createdAt": {
//         "$date": "2025-03-19T16:26:13.718Z"
//       },
//       "updatedAt": {
//         "$date": "2025-03-19T16:26:13.718Z"
//       }
//     },
//     {
//       "taskCompletionState": 100,
//       "createdAt": {
//         "$date": "2025-03-19T16:29:41.775Z"
//       },
//       "updatedAt": {
//         "$date": "2025-03-19T16:29:41.775Z"
//       }
//     }
//   ],
//   "__v": 3
// }
