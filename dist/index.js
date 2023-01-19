"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dialogflow_fulfillment_1 = require("dialogflow-fulfillment");
const handleGreeting_1 = require("./src/handles/handleGreeting");
const handlePointOfInterest_1 = require("./src/handles/handlePointOfInterest");
const dotenv_1 = __importDefault(require("dotenv"));
const actions_on_google_1 = require("actions-on-google");
const request_promise_1 = __importDefault(require("request-promise"));
const bot_sdk_1 = require("@line/bot-sdk");
const config = {
    channelAccessToken: "F1HHZ+Abw8hkb/WKRBUOsMfpV1A8euZV22XldoIFwCfcPbgSy9gmmqm9IgeNrfveI3YYXEJ6di1CPaZy1CC3+R9Xbek78YqjB0l5P2QWta+iN6lY3dqNRFf+OR6ORPWU3MYmq6S5KxZ16+gH2QstRQdB04t89/1O/w1cDnyilFU=",
    channelSecret: "36069836ad565377eaf962b38fa856d7",
};
const client = new bot_sdk_1.Client(config);
// const middleware = require("@line/bot-sdk").middleware;
// const JSONParseError = require("@line/bot-sdk").JSONParseError;
// const SignatureValidationFailed =
//   require("@line/bot-sdk").SignatureValidationFailed;
// const Client = require("@line/bot-sdk").Client;
// Create an app instance
const dfl = (0, actions_on_google_1.dialogflow)();
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.NODE_PORT || 4050;
const TOKEN = process.env.LINE_ACCESS_TOKEN;
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("Server Is Working......");
});
/**
 * on this route dialogflow send the webhook request
 * For the dialogflow we need POST Route.
 **/
app.post("/webhook", (req, res) => {
    // get agent from request
    let agent = new dialogflow_fulfillment_1.WebhookClient({ request: req, response: res });
    // create intentMap for handle intent
    let intentMap = new Map();
    // add intent map 2nd parameter pass function
    intentMap.set("webhook", () => {
        const conv = agent.conv();
        conv.ask(new actions_on_google_1.Permission({
            context: "To locate you",
            permissions: "DEVICE_PRECISE_LOCATION",
        }));
    });
    // intent poi
    intentMap.set("ธนาคาร", handlePointOfInterest_1.getlocation);
    intentMap.set("โรงพยาบาล", handlePointOfInterest_1.getlocation);
    intentMap.set("ร้านค้า", handlePointOfInterest_1.getlocation);
    intentMap.set("ปั้มน้ำมัน", handlePointOfInterest_1.getlocation);
    intentMap.set("ธนาคาร", handlePointOfInterest_1.getlocation);
    intentMap.set("ร้านอาหาร", handleGreeting_1.getGreeting);
    // now agent is handle request and pass intent map
    agent.handleRequest(intentMap);
});
app.post("/webhooks", (0, bot_sdk_1.middleware)(config), function (req, res) {
    console.log(req.body.events);
    res.send("HTTP POST request sent to the webhook URL!");
    let event = req.body.events[0];
    if (event.type === "message" && event.message.type === "location") {
        postToDialogflow(req);
    }
    else if (event.type === "message" && event.message.type === "text") {
        postToDialogflow(req);
    }
    else {
        reply(req);
    }
});
const postToDialogflow = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const body = JSON.stringify(req.body);
    req.headers.host = "dialogflow.cloud.google.com";
    const res = yield request_promise_1.default.post({
        uri: "https://dialogflow.cloud.google.com/v1/integrations/line/webhook/ec92fe83-908d-4727-9759-287df892b637",
        headers: req.headers,
        body: body,
    });
    console.log("res", res);
    return res;
});
const reply = (req) => {
    const event = req.body.events[0];
    client.pushMessage(event.sourse.userId, {
        type: "text",
        text: "Sorry, this chatbot did not support message type " +
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
app.use((err, req, res, next) => {
    if (err instanceof bot_sdk_1.SignatureValidationFailed) {
        res.status(401).send(err.signature);
        return;
    }
    else if (err instanceof bot_sdk_1.JSONParseError) {
        res.status(400).send(err.raw);
        return;
    }
    next(err); // will throw default 500
});
app.listen(port, () => {
    console.log(`Server is running at port: ${port}`);
});
