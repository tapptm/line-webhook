import express, { Express, Request, Response } from "express";
import { getlocation } from "./src/handles/handlePointOfInterest";
import { sessionClient, sessionPath } from "./src/configs/dialogflow";
import dotenv from "dotenv";
import { replyMessage } from "./src/services/linesdk/linesdk.service";
import { postToDialogflow } from "./src/services/dialogflows/dialogflow.service";
import fs from "fs";
import pvi from "./src/assets/previous_intent.json";

dotenv.config();
const app: Express = express();
const port = process.env.NODE_PORT || 4050;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Server Is Working......");
});

app.post("/webhooks", async function (req: Request, res: Response) {
  const event = req.body.events[0];
  console.log(req.body.events);

  if (event.type === "message" && event.message.type === "text") {
    try {
      const dialogRes = await postToDialogflow(req);
      if (dialogRes.status.code === 200) {
        const requestIntent = {
          session: sessionPath,
          queryInput: {
            text: {
              text: event.message.text,
              languageCode: "th-TH",
            },
          },
        };

        const responses = await sessionClient.detectIntent(requestIntent);
        const result: any = responses[0].queryResult;
        const intent = result.intent.displayName;

        console.log(result);

        if (
          intent === "โรงพยาบาล" ||
          intent === "ร้านค้า" ||
          intent === "ปั้มน้ำมัน" ||
          intent === "ธนาคาร"
        ) {
          fs.writeFileSync(
            "./src/assets/previous_intent.json",
            JSON.stringify({ intent: result.intent.displayName })
          );
        }
      }
    } catch (error: any) {
      res.send({ message: error.message });
    }
  } else if (event.type === "message" && event.message.type === "location") {
    try {
      await getlocation({
        intent: pvi.intent,
        latitude: event.message.latitude,
        longitude: event.message.longitude,
        userId: event.source.userId,
      });
    } catch (error: any) {
      res.send({ message: error.message });
    }
  } else {
    replyMessage(
      event.source.userId,
      `Sorry, this chatbot did not support message type ${event.message.type}`
    );
  }
});

app.listen(port, () => {
  console.log(`Server is running at port: ${port}`);
});
