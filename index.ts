import express, { Express, NextFunction, Request, Response } from "express";
import { WebhookClient } from "dialogflow-fulfillment";
import { getGreeting } from "./src/handles/handleGreeting";
import {
  getlocation,
  getlocationByWebhook,
} from "./src/handles/handlePointOfInterest";
import { sessionClient, sessionPath } from "./src/configs/dialogflow";
import dotenv from "dotenv";
import expressSession from "express-session";
import { reply } from "./src/services/linesdk/linesdk.service";
import { postToDialogflow } from "./src/services/dialogflows/dialogflow.service";
import fs from 'fs';
import * as path from 'path'
import pvi from "./src/assets/previous_intent.json"


// Create an app instance
dotenv.config();
const app: Express = express();
const port = process.env.NODE_PORT || 4050;

app.use(
  expressSession({
    secret: "sample-secret",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(express.json());


app.get("/", (req: Request, res: Response) => {
  console.log(req.session);

  res.send("Server Is Working......");
});

app.post("/test", (req: Request, res: Response) => {
  if (req.body.key === "aa") {
    req.session.bot_session = "haha11";
    console.log(req.session);
    res.send(req.session.bot_session);
  } else if (req.body.key === "bb") {
    console.log(req.session);
    res.send(req.session.bot_session);
  }
});
/**
 * on this route dialogflow send the webhook request
 * For the dialogflow we need POST Route.
 **/
app.post("/webhook", (req: Request, res: Response) => {
  // get agent from request
  let agent = new WebhookClient({ request: req, response: res });
  // create intentMap for handle intent
  let intentMap = new Map();
  // add intent map 2nd parameter pass function
  intentMap.set("ธนาคาร", getlocation);
  intentMap.set("โรงพยาบาล", getlocation);
  intentMap.set("ร้านค้า", getlocation);
  intentMap.set("ปั้มน้ำมัน", getlocation);
  intentMap.set("ธนาคาร", getlocation);
  intentMap.set("ร้านอาหาร", getGreeting);

  // now agent is handle request and pass intent map
  agent.handleRequest(intentMap);
});

declare module "express-session" {
  interface SessionData {
    bot_session: string;
  }
}

app.post(
  "/webhooks",
  async function (req: Request, res: Response, next: NextFunction) {
    let event = req.body.events[0];
    console.log(req.body.events);

    const sessionData = req.session;
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

      console.log(result.intent.displayName);

      if (result.intent.displayName === "food", result.intent.displayName === "ธนาคาร") {
        console.log("food");
        // sessionData.bot_session = { intent: result.intent.displayName };
        sessionData.bot_session = result.intent.displayName;
        console.log(sessionData.bot_session);
        fs.writeFileSync(
          path.join(__dirname, 'src/assets/previous_intent.json'), 
          JSON.stringify({intent: result.intent.displayName})
        );
      }
      console.log(`Query: ${result.queryText}`);
      console.log(`Response: ${result.fulfillmentText}`);

      // return;
    } else if (event.type === "message" && event.message.type === "location") {
      console.log(pvi.intent);
      getlocationByWebhook({
        intent: pvi.intent,
        latitude: event.message.latitude,
        longitude: event.message.longitude,
        userId: event.source.userId,
      });
      // return;
      // postToDialogflow(req);
    } else {
      reply(
        event.source.userId,
        `Sorry, this chatbot did not support message type ${event.message.type}`
      );
      // return;
    }
  }
);

app.listen(port, () => {
  console.log(`Server is running at port: ${port}`);
});
