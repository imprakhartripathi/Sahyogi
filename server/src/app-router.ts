import express from "express";
const router = express.Router();

import signupController from "./controllers/signupController";
import loginController from "./controllers/loginController";
import getCurrentUserController from "./controllers/getCurrentUserController";
import genAIController from "./controllers/genAI";
import userInfoController from "./controllers/userInfoController";
import logoutController from "./controllers/logoutController";

router.post('/signup', signupController);

router.post('/login', loginController);

router.get("/getcurusr", getCurrentUserController)

router.post("/getuserinfo", userInfoController)

router.post("/logout", logoutController)

router.get("/genai", genAIController)

export default router;
