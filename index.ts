import express, { Express, NextFunction, Request, Response } from "express";
import { WebhookClient } from "dialogflow-fulfillment";
import { getGreeting } from "./src/handles/handleGreeting";
import { getlocation } from "./src/handles/handlePointOfInterest";
import dotenv from "dotenv";
import { dialogflow, Permission, SimpleResponse } from "actions-on-google";
import https from "https";
import request from "request-promise";

import { Client } from "@line/bot-sdk";

const config = {
  channelAccessToken:
    "F1HHZ+Abw8hkb/WKRBUOsMfpV1A8euZV22XldoIFwCfcPbgSy9gmmqm9IgeNrfveI3YYXEJ6di1CPaZy1CC3+R9Xbek78YqjB0l5P2QWta+iN6lY3dqNRFf+OR6ORPWU3MYmq6S5KxZ16+gH2QstRQdB04t89/1O/w1cDnyilFU=",
  channelSecret: "36069836ad565377eaf962b38fa856d7",
};

const client = new Client(config);

// const middleware = require("@line/bot-sdk").middleware;
// const JSONParseError = require("@line/bot-sdk").JSONParseError;
// const SignatureValidationFailed =
//   require("@line/bot-sdk").SignatureValidationFailed;

// const Client = require("@line/bot-sdk").Client;

// Create an app instance
const dfl = dialogflow();
dotenv.config();
const app: Express = express();
const port = process.env.NODE_PORT || 4050;
const TOKEN = process.env.LINE_ACCESS_TOKEN;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
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
  intentMap.set("webhook", () => {
    const conv = agent.conv();
    conv.ask(
      new Permission({
        context: "To locate you",
        permissions: "DEVICE_PRECISE_LOCATION",
      })
    );
  });

  // intent poi
  intentMap.set("ธนาคาร", getlocation);
  intentMap.set("โรงพยาบาล", getlocation);
  intentMap.set("ร้านค้า", getlocation);
  intentMap.set("ปั้มน้ำมัน", getlocation);
  intentMap.set("ธนาคาร", getlocation);
  intentMap.set("ร้านอาหาร", getGreeting);

  // now agent is handle request and pass intent map
  agent.handleRequest(intentMap);
});

app.post("/webhooks", function (req: Request, res: Response) {
  console.log(req.body.events);

  res.send("HTTP POST request sent to the webhook URL!");
  let event = req.body.events[0];

  if (event.type === "message" && event.message.type === "location") {
    postToDialogflow(req);
  } else if (event.type === "message" && event.message.type === "text") {
    postToDialogflow(req);
  } else {
    reply(req);
  }
});

const postToDialogflow = async (req: any) => {
  const body = JSON.stringify(req.body);
  req.headers.host = "dialogflow.cloud.google.com";

  const res = await request.post({
    uri: "https://dialogflow.cloud.google.com/v1/integrations/line/webhook/ec92fe83-908d-4727-9759-287df892b637",
    headers: req.headers,
    body: body,
  });
  console.log("res", res);

  return res;
};

const reply = (req: any) => {
  const event = req.body.events[0];
  client.pushMessage(event.sourse.userId, {
    type: "text",
    text:
      "Sorry, this chatbot did not support message type " +
      req.body.events[0].message.type,
  });

  // const dataString = JSON.stringify({
  //   replyToken: req.body.events[0].replyToken,
  //   messages: [
  //     {
  //       type: "text",
  //       text:
  //         "Sorry, this chatbot did not support message type " +
  //         req.body.events[0].message.type,
  //     },
  //   ],
  // });

  // // Request header
  // const headers = {
  //   "Content-Type": "application/json",
  //   Authorization: "Bearer " + TOKEN,
  // };

  // // Options to pass into the request
  // const webhookOptions = {
  //   hostname: "api.line.me",
  //   path: "/v2/bot/message/reply",
  //   method: "POST",
  //   headers: headers,
  //   body: dataString,
  // };

  // // Define request
  // const request = https.request(webhookOptions, (res) => {
  //   res.on("data", (d) => {
  //     process.stdout.write(d);
  //   });
  // });

  // // Handle error
  // request.on("error", (err) => {
  //   console.error(err);
  // });

  // // Send data
  // request.write(dataString);
  // request.end();
};

app.listen(port, () => {
  console.log(`Server is running at port: ${port}`);
});
