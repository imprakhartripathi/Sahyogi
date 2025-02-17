import express from "express";
const router = express.Router();

import signupController from "./controllers/signupController";
import loginController from "./controllers/loginController";
import getCurrentUserController from "./controllers/getCurrentUserController";

router.post('/signup', signupController);

router.post('/login', loginController);

router.get("/getcurusr", getCurrentUserController)

export default router;
