import express, { Express, Request, Response } from "express";
import {
  textController,
  locationController,
  stickerController,
  imageController,
  webhooksController,
} from "./src/controllers/webhooks";
import dotenv from "dotenv";
dotenv.config();

const app: Express = express();
const PORT = process.env.NODE_PORT || 4050;

app.use(express.json());

app.get("/", async (req: Request, res: Response) => {
  res.send("Server Is Working......");
});

app.post(
  "/webhooks",
  textController,
  locationController,
  stickerController,
  imageController,
  webhooksController
);

app.listen(PORT, () => {
  console.log(`Server is running at port: ${PORT}`);
});
