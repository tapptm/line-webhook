import express, { Express, Request, Response } from "express";
import helmet from "helmet";
import {
  textController,
  locationController,
  stickerController,
  imageController,
  noTypeController,
} from "./src/controllers/webhooks";

const app: Express = express();
const PORT = process.env.NODE_PORT || 4050;

app.use(express.json());
app.use(helmet());

app.get("/", async (req: Request, res: Response) => {
  res.send("Server Is Working......");
});

app.post(
  "/webhooks",
  textController,
  locationController,
  stickerController,
  imageController,
  noTypeController
);

app.listen(PORT, () => {
  console.log(`Server is running at port: ${PORT}`);
});
