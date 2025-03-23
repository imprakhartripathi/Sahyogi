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
import createProjectsController from "./controllers/createProject";
import getProjectsController from "./controllers/getProjects";
import editProjectController from "./controllers/editProject";
import deleteProjectController from "./controllers/deleteProject";
import getProjectTasksController from "./controllers/getProjectTask";
import createProjectTaskController from "./controllers/createProjectTask";
import editProjectTaskController from "./controllers/editProjectTask";
import deleteProjectTaskController from "./controllers/deleteProjectTask";

// Auth Routes
router.post("/signup", signupController);
router.post("/login", loginController);
router.post("/logout", logoutController);
router.get("/getcurusr", getCurrentUserController);
router.post("/getuserinfo", userInfoController);

// AI Route
router.get("/ai/call", genAIController);

// Task Routes
router.get("/tasks/get", getTasksController)
router.post("/tasks/create", createTaskController);
router.patch("/tasks/edit", editTaskController);
router.delete("/tasks/delete", deleteTaskController);

// Project Routes
router.get("/projects/get", getProjectsController);
router.post("/projects/create", createProjectsController);
router.patch("/projects/edit", editProjectController);
router.delete("/projects/delete", deleteProjectController);

// Task Under a Project Routes

router.get("/projects/tasks/get", getProjectTasksController);
router.post("/projects/tasks/create", createProjectTaskController);
router.patch("/projects/tasks/edit", editProjectTaskController);
router.delete("/projects/tasks/delete", deleteProjectTaskController);


export default router;
