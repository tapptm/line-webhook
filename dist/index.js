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
const dfl = (0, actions_on_google_1.dialogflow)();
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
    console.log(agent);
    // create intentMap for handle intent
    // dfl.intent("webhook", conv => {
    //   conv.ask(
    //     new Permission({
    //       context: "To locate you",
    //       permissions: "DEVICE_PRECISE_LOCATION",
    //     })
    //   );
    // })
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
app.listen(port, () => {
    console.log(`Server is running at port: ${port}`);
});
