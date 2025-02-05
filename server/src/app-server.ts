import express from "express";
import mongoose from "mongoose";
import path from "path";
import cors from "cors";
import bodyParser from "body-parser";
import router from "./app-router";
import { clientPort, serverPort } from "./serversettings";

const __dirname = path.resolve();
const mongoDBurl = "mongodb://localhost:27017/miniproject2DB";
const app = express();

app.use(cors({ credentials: true, origin: [clientPort] }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "static")));
app.use(router);

mongoose
  .connect(mongoDBurl)
  .then(() => {
    console.log("MongoDB Connection Successful");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

app.listen(serverPort, () => {
  console.log(
    `Server Running On Port ${serverPort} | Local - http://localhost:${serverPort}`
  );
});
