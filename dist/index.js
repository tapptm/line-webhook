"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dialogflow_fulfillment_1 = require("dialogflow-fulfillment");
const dotenv_1 = __importDefault(require("dotenv"));
const handleGreeting_1 = require("./src/handles/handleGreeting");
const handleLocations_1 = require("./src/handles/handleLocations");
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
    intentMap.set("webhook", handleGreeting_1.getGreeting);
    intentMap.set("ทำไร", handleLocations_1.getLocations);
    // now agent is handle request and pass intent map
    agent.handleRequest(intentMap);
});
app.listen(port, () => {
    console.log(`Server is running at port: ${port}`);
});
