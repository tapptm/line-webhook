import express, { Express, Request, Response } from "express";
import { webhooksController } from "./src/controllers/webhook_old";
import { getAudioDurationInSeconds } from "get-audio-duration";
import dotenv from "dotenv";
import {getActivity} from "./src/models/activity";
import { Activity } from "./src/dto/activity.dto";
dotenv.config();

const app: Express = express();
const PORT = process.env.NODE_PORT || 4050;

app.use(express.json());

app.get("/", async (req: Request, res: Response) => {
  // const duration = await getAudioDurationInSeconds(
  //   "./src/assets/audios/audio_example.mp3"
  // );
  // console.log(duration);
  res.send("Server Is Working......");
});

app.post("/webhooks", webhooksController);

app.get("/activity", async (req, res) => {
  const rows: Activity[] = await getActivity()

  res.send(rows)
});

app.listen(PORT, () => {
  console.log(`Server is running at port: ${PORT}`);
});
