import express from "express";
import path from "path";
import cors from "cors";
import bodyParser from "body-parser";
import router from "./app-router";
import { clientPort, serverPort } from "./serversettings";

const app = express();
app.use(cors({ credentials: true, origin: [clientPort] }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "static")));
app.use(router);

app.listen(serverPort, () => {
  console.log(
    `Server Running On Port ${serverPort} | Local - http://localhost:${serverPort}`
  );
});
