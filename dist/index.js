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
const dialogflow_1 = require("./src/configs/dialogflow");
const linesdk_1 = require("./src/configs/linesdk");
const dotenv_1 = __importDefault(require("dotenv"));
const request_promise_1 = __importDefault(require("request-promise"));
const express_session_1 = __importDefault(require("express-session"));
// Create an app instance
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.NODE_PORT || 4050;
app.use(express_1.default.json());
app.use((0, express_session_1.default)({
    secret: "mysecret",
    resave: false,
    saveUninitialized: true,
}));
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
    intentMap.set("ธนาคาร", handlePointOfInterest_1.getlocation);
    intentMap.set("โรงพยาบาล", handlePointOfInterest_1.getlocation);
    intentMap.set("ร้านค้า", handlePointOfInterest_1.getlocation);
    intentMap.set("ปั้มน้ำมัน", handlePointOfInterest_1.getlocation);
    intentMap.set("ธนาคาร", handlePointOfInterest_1.getlocation);
    intentMap.set("ร้านอาหาร", handleGreeting_1.getGreeting);
    // now agent is handle request and pass intent map
    agent.handleRequest(intentMap);
});
app.post("/webhooks", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(req.body.events);
        const sessionData = req.session;
        res.send("HTTP POST request sent to the webhook URL!");
        let event = req.body.evients[0];
        const request111 = {
            session: dialogflow_1.sessionPath,
            queryInput: {
                text: {
                    // The query to send to the dialogflow agent
                    text: event.message.text,
                    // The language used by the client (en-US)
                    languageCode: "en-US",
                },
            },
        };
        if (event.type === "message" && event.message.type === "location") {
            console.log(sessionData.bot_session);
            (0, handlePointOfInterest_1.getlocationByWebhook)({
                intent: sessionData.bot_session.intent,
                latitude: event.message.latitude,
                longitude: event.message.longitude,
                userId: event.source.userId,
            });
            postToDialogflow(req);
        }
        else if (event.type === "message" && event.message.type === "text") {
            postToDialogflow(req);
            const responses = yield dialogflow_1.sessionClient.detectIntent(request111);
            console.log("Detected intent");
            const result = responses[0].queryResult;
            console.log(result);
            if (result.intent.displayName === "food") {
                sessionData.bot_session = { intent: result.intent.displayName };
            }
            console.log(`Query: ${result.queryText}`);
            console.log(`Response: ${result.fulfillmentText}`);
        }
        else {
            reply(req);
        }
    });
});
const postToDialogflow = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const body = JSON.stringify(req.body);
    req.headers.host = "dialogflow.cloud.google.com";
    return request_promise_1.default.post({
        uri: "https://dialogflow.cloud.google.com/v1/integrations/line/webhook/ec92fe83-908d-4727-9759-287df892b637",
        headers: req.headers,
        body: body,
    });
});
const reply = (req) => {
    const event = req.body.events[0];
    linesdk_1.client.pushMessage(event.source.userId, {
        type: "text",
        text: "Sorry, this chatbot did not support message type " +
            req.body.events[0].message.type,
    });
};
app.listen(port, () => {
    console.log(`Server is running at port: ${port}`);
});
