import express, { Express, Request, Response } from "express";
import { webhooksController } from "./src/controllers/webhooks";
import { getAudioDurationInSeconds } from "get-audio-duration";
import dotenv from "dotenv";
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

app.listen(PORT, () => {
  console.log(`Server is running at port: ${PORT}`);
});
