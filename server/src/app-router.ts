import express from "express";
const router = express.Router();

import signupController from "./controllers/signupController";
import loginController from "./controllers/loginController";
import getCurrentUserController from "./controllers/getCurrentUserController";
import genAIController from "./controllers/aiController";
import userInfoController from "./controllers/userInfoController";
import logoutController from "./controllers/logoutController";
import createTaskController from "./controllers/createTask";
import editTaskController from "./controllers/editTask";
import deleteTaskController from "./controllers/deleteTask";
import showAllTasksController from "./controllers/showAllTasks";

router.post('/signup', signupController);

router.post('/login', loginController);

router.get("/getcurusr", getCurrentUserController)

router.post("/getuserinfo", userInfoController)

router.post("/logout", logoutController)

router.get("/genai", genAIController)

router.post("/tasks", createTaskController); // Create task

router.put("/tasks/:userEmail/:taskNumber", editTaskController); // Edit task

router.delete("/tasks/:userEmail/:taskNumber", deleteTaskController); // Delete task

router.get("/tasks/:userEmail", showAllTasksController); // Get all tasks

export default router;
