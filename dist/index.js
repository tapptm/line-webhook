"use strict";
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
const postToDialogflow = (req) => {
    const body = JSON.stringify(req.body);
    req.headers.host = "dialogflow.cloud.google.com";
    return request_promise_1.default.post({
        uri: "https://dialogflow.cloud.google.com/v1/integrations/line/webhook/ec92fe83-908d-4727-9759-287df892b637",
        headers: req.headers,
        body: body,
    });
};
const reply = (req) => {
    return request_promise_1.default.post({
        uri: `api.line.me/v2/bot/message/reply`,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TOKEN}`,
        },
        body: JSON.stringify({
            replyToken: req.body.events[0].replyToken,
            messages: [
                {
                    type: "text",
                    text: "Sorry, this chatbot did not support message type " +
                        req.body.events[0].message.type,
                },
            ],
        }),
    });
};
function randomItem(items) {
    return items[Math.floor(Math.random() * items.length)];
}
app.post("/webhooks", function (req, res) {
    console.log(req.body.events);
    res.send("HTTP POST request sent to the webhook URL!");
    let event = req.body.events[0];
    // If the user sends a message to your bot, send a reply message
    if (event.type === "message" && event.message.type === "sticker") {
        let keywords = event.message.keywords;
        console.log("key", keywords);
        let stickerIntent = "";
        for (let i = 0; i <= 2; i++) {
            stickerIntent += randomItem(keywords) + " ";
        }
        console.log("st", stickerIntent);
        const newBody = {
            destination: req.body.destination,
            events: [
                {
                    timestamp: req.body.events[0].timestamp,
                    mode: req.body.events[0].mode,
                    source: req.body.events[0].source,
                    replyToken: req.body.events[0].replyToken,
                    type: "message",
                    message: {
                        type: "text",
                        id: req.body.events[0].message.id,
                        text: stickerIntent,
                    },
                },
            ],
        };
        console.log('body', newBody.events[0].message.text);
        req.body = newBody;
        postToDialogflow(req);
    }
    else if (event.type === "message" && event.message.type === "text") {
        console.log("text");
        postToDialogflow(req);
    }
    else {
        reply(req);
    }
});
app.listen(port, () => {
    console.log(`Server is running at port: ${port}`);
});
