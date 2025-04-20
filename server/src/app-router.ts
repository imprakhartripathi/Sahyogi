import express from "express";
const router = express.Router();

import signupController from "./controllers/signupController";
import loginController from "./controllers/loginController";
import getCurrentUserController from "./controllers/getCurrentUserController";
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
import editUserController from "./controllers/editUser";
import deleteUserController from "./controllers/deleteUser";
import handleSupportMail from "./controllers/supportMailClient";
import { getNotificationsByEmail, updateNotificationReadState } from "./controllers/notificationsController";
import changePasswordController from "./controllers/changePassword";
import { initiatePasswordReset, validateOtp, validateOtpAndResetPassword } from "./controllers/forgetPassword";
import aiController from "./controllers/aiController";

// Auth Routes
router.post("/signup", signupController);
router.post("/login", loginController);
router.post("/logout", logoutController);
router.get("/getcurusr", getCurrentUserController);
router.post("/getuserinfo", userInfoController);
router.patch("/user/edit", editUserController);
router.delete("/user/delete", deleteUserController);
router.post("/user/pwchange", changePasswordController);

router.post('/user/initiate-reset', initiatePasswordReset);
router.post('/user/validate-otp', validateOtp);
router.post('/user/reset-password', validateOtpAndResetPassword);


// Mail Clients
router.get('/mail/support', handleSupportMail);

// AI Route
router.get("/ai/call", aiController);

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

// Notifications
router.get("/user/notifications/get", getNotificationsByEmail);
router.put("/user/notifications/read", updateNotificationReadState)


export default router;
