import express, { Express, NextFunction, Request, Response } from "express";
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
import connectRedis from 'connect-redis';
import * as redis from 'redis';

const redisClient = redis.createClient({
  url: 'redis://172.16.128.16:6379',
  legacyMode: true
});

redisClient.on("error", function (err) {
  console.log("Error " + err);
});

redisClient.on("ready", () => {
  console.log('✅ 💃 redis have ready !')
 })
 
redisClient.on("connect", () => {
  console.log('✅ 💃 connect redis success !')
 })

const RedisStore = connectRedis(expressSession);
const sessionOptions: expressSession.SessionOptions = {
  store: new RedisStore({
    client: redisClient
  }),
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true }
};

// Create an app instance
dotenv.config();
const app: Express = express();
const port = process.env.NODE_PORT || 4050;

app.use(express.json());
app.use(expressSession(sessionOptions));


app.get("/", (req: Request, res: Response) => {
  console.log(req.session);

  res.send("Server Is Working......");
});

app.get("/test", (req: Request, res: Response) => {
  console.log(req.session);
  req.session.bot_session = "haha"
  console.log(req.session.bot_session );
  
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

      if (result.intent.displayName === "food") {
        console.log("food");
        // sessionData.bot_session = { intent: result.intent.displayName };
        sessionData.bot_session = result.intent.displayName;

        console.log(sessionData.bot_session);
        req.session.save((err) => {
          if (err) {
            return next(err);
          }

          console.log("OK");
        });
      }
      console.log(`Query: ${result.queryText}`);
      console.log(`Response: ${result.fulfillmentText}`);

      // return;
    } else if (event.type === "message" && event.message.type === "location") {
      console.log(sessionData.bot_session);
      console.log(req.session);

      getlocationByWebhook({
        intent: sessionData.bot_session,
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
