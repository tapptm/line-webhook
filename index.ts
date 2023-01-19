import express, { Express, Request, Response } from "express";
import { WebhookClient } from "dialogflow-fulfillment";
import { getGreeting } from "./src/handles/handleGreeting";
import {
  getlocation,
  getlocationByWebhook,
} from "./src/handles/handlePointOfInterest";
import { sessionClient, sessionPath } from "./src/configs/dialogflow";
import { client as clientsdk } from "./src/configs/linesdk";
import dotenv from "dotenv";
import request from "request-promise";
import expressSession from "express-session";
import { reply } from "./src/services/linesdk/linesdk.service";
import { postToDialogflow } from "./src/services/dialogflows/dialogflow.service";
// Create an app instance
dotenv.config();
const app: Express = express();
const port = process.env.NODE_PORT || 4050;

app.use(express.json());
app.use(
  expressSession({
    secret: "mysecret", // used to sign the session ID cookie
    resave: false,
    saveUninitialized: true,
  })
);

app.get("/", (req: Request, res: Response) => {
  console.log(req.session);

  res.send("Server Is Working......");
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
    bot_session: {
      intent: string;
    };
  }
}

app.post("/webhooks", async function (req: Request , res: Response) {
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

  if (event.type === "message" && event.message.type === "location") {
    console.log(sessionData.bot_session);
    console.log(req.session);

    getlocationByWebhook({
      intent: sessionData.bot_session?.intent,
      latitude: event.message.latitude,
      longitude: event.message.longitude,
      userId: event.source.userId,
    });
    return;
    // postToDialogflow(req);
  } else if (event.type === "message" && event.message.type === "text") {
    postToDialogflow(req);

    const responses = await sessionClient.detectIntent(request111);
    console.log("Detected intent");
    const result: any = responses[0].queryResult;
    console.log(result);

    console.log(result.intent.displayName);

    if (result.intent.displayName === "food") {
      console.log("food");
      sessionData.bot_session = { intent: result.intent.displayName };
    }
    console.log(`Query: ${result.queryText}`);
    console.log(`Response: ${result.fulfillmentText}`);

    return;
  } else {
    reply(
      event.source.userId,
      `Sorry, this chatbot did not support message type ${event.message.type}`
    );
    return;
  }
});

app.listen(port, () => {
  console.log(`Server is running at port: ${port}`);
});
