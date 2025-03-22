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
import getTasksController from "./controllers/getTasks";

// Auth Routes
router.post("/signup", signupController);
router.post("/login", loginController);
router.post("/logout", logoutController);
router.get("/getcurusr", getCurrentUserController);
router.post("/getuserinfo", userInfoController);

// AI Route
router.get("/genai", genAIController);

// Task Routes
router.get("/tasks/get", getTasksController)
router.post("/tasks/create", createTaskController);
router.patch("/tasks/edit", editTaskController);
router.delete("/tasks/delete", deleteTaskController);

export default router;
