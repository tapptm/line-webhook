import express, { Express, Request, Response } from "express";
import { webhooksController } from "./src/controllers/webhooks";
import dotenv from "dotenv";
dotenv.config();

const app: Express = express();
const PORT = process.env.NODE_PORT || 4050;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Server Is Working......");
});

app.post("/webhooks", webhooksController);

app.listen(PORT, () => {
  console.log(`Server is running at port: ${PORT}`);
});
