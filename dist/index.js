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
const dotenv_1 = __importDefault(require("dotenv"));
const linesdk_service_1 = require("./src/services/linesdk/linesdk.service");
const dialogflow_service_1 = require("./src/services/dialogflows/dialogflow.service");
const fs_1 = __importDefault(require("fs"));
const previous_intent_json_1 = __importDefault(require("./src/assets/previous_intent.json"));
// Create an app instance
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.NODE_PORT || 4050;
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
        const event = req.body.events[0];
        console.log(req.body.events);
        const request111 = {
            session: dialogflow_1.sessionPath,
            queryInput: {
                text: {
                    text: event.message.text,
                    languageCode: "en-US",
                },
            },
        };
        if (event.type === "message" && event.message.type === "text") {
            (0, dialogflow_service_1.postToDialogflow)(req);
            const responses = yield dialogflow_1.sessionClient.detectIntent(request111);
            console.log("Detected intent");
            const result = responses[0].queryResult;
            console.log(result);
            const intent = result.intent.displayName;
            if (intent === "food" || intent === "ธนาคาร") {
                fs_1.default.writeFileSync("./src/assets/previous_intent.json", JSON.stringify({ intent: result.intent.displayName }));
            }
        }
        else if (event.type === "message" && event.message.type === "location") {
            (0, handlePointOfInterest_1.getlocationByWebhook)({
                intent: previous_intent_json_1.default.intent,
                latitude: event.message.latitude,
                longitude: event.message.longitude,
                userId: event.source.userId,
            });
        }
        else {
            (0, linesdk_service_1.reply)(event.source.userId, `Sorry, this chatbot did not support message type ${event.message.type}`);
        }
    });
});
app.listen(port, () => {
    console.log(`Server is running at port: ${port}`);
});
