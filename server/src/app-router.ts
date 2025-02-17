import express from "express";
const router = express.Router();

import signupController from "./controllers/signupController";
import loginController from "./controllers/loginController";

router.post('/signup', signupController);

router.post('/login', loginController);

export default router;
