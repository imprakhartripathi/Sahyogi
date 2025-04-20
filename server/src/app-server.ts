import express from "express";
import mongoose from "mongoose";
import path from "path";
import cors from "cors";
import bodyParser from "body-parser";
import router from "./app-router";
import { localClientPort, ngrokPort, serverPort } from "./serversettings";
import dotenv from "dotenv";

import deadlineNotificationController from "./controllers/real.time.notification";
import cron from 'node-cron';

dotenv.config();

const __dirname = path.resolve();

const mongoDBurl = process.env.MONGODB_URI as string;
if (!mongoDBurl) {
  console.error("❌ MongoDB URI is missing! Set MONGODB_URI in .env");
  process.exit(1);
}

const app = express();

app.use(cors({ credentials: true, origin: [localClientPort, ngrokPort] }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "static")));
app.use(router);
app.use(express.json());

// MongoDB Atlas connection
mongoose
  .connect(mongoDBurl, {
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB Atlas");
  })
  .catch((error) => {
    console.error("❌ Error connecting to MongoDB Atlas:", error);
    process.exit(1); 
  });


  // Run at 9 AM and 5 PM IST (3:30 AM and 11:30 AM UTC)
cron.schedule('30 3,11 * * *', deadlineNotificationController);

app.listen(serverPort, () => {
  console.log(
    `🚀 Server Running On Port ${serverPort} | Local - http://localhost:${serverPort}`
  );
});
