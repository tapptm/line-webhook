import express, { Express, Request, Response } from "express";
import { getlocation } from "./src/handles/handlePointOfInterest";
import { sessionClient, sessionPath } from "./src/configs/dialogflow";
import dotenv from "dotenv";
import { reply } from "./src/services/linesdk/linesdk.service";
import { postToDialogflow } from "./src/services/dialogflows/dialogflow.service";
import fs from "fs";
import pvi from "./src/assets/previous_intent.json";

// Create an app instance
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
  const request111 = {
    session: sessionPath,
    queryInput: {
      text: {
        text: event.message.text,
        languageCode: "en-US",
      },
    },
  };

  if (event.type === "message" && event.message.type === "text") {
    postToDialogflow(req);

    const responses = await sessionClient.detectIntent(request111);
    console.log("Detected intent");
    const result: any = responses[0].queryResult;
    console.log(result);
    const intent = result.intent.displayName;

    if (intent === "food" || intent === "ธนาคาร") {
      fs.writeFileSync(
        "./src/assets/previous_intent.json",
        JSON.stringify({ intent: result.intent.displayName })
      );
    }
  } else if (event.type === "message" && event.message.type === "location") {
    getlocation({
      intent: pvi.intent,
      latitude: event.message.latitude,
      longitude: event.message.longitude,
      userId: event.source.userId,
    });
  } else {
    reply(
      event.source.userId,
      `Sorry, this chatbot did not support message type ${event.message.type}`
    );
  }
});

app.listen(port, () => {
  console.log(`Server is running at port: ${port}`);
});
