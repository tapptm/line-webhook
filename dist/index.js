"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const actions_on_google_1 = require("actions-on-google");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const dlf = (0, actions_on_google_1.dialogflow)();
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
    // let agent = new WebhookClient({ request: req, response: res });
    // // create intentMap for handle intent
    // let intentMap = new Map();
    // // add intent map 2nd parameter pass function
    // intentMap.set("webhook", getGreeting);
    // // intent poi
    // intentMap.set("ธนาคาร", getlocation);
    // intentMap.set("โรงพยาบาล", getlocation);
    // intentMap.set("ร้านค้า", getlocation);
    // intentMap.set("ปั้มน้ำมัน", getlocation);
    // intentMap.set("ธนาคาร", getlocation);
    // intentMap.set("ร้านอาหาร", getGreeting);
    // // now agent is handle request and pass intent map
    // agent.handleRequest(intentMap);
    dlf.intent("locat", (conv) => {
        conv.data.requestedPermission = "DEVICE_PRECISE_LOCATION";
        conv.ask(new actions_on_google_1.SimpleResponse('Welcome to location tracker'));
        return conv.ask(new actions_on_google_1.Permission({
            context: "to locate you",
            permissions: conv.data.requestedPermission
        }));
    });
    dlf.intent("get_current_location", (conv, params, permissionGranted) => {
        if (permissionGranted) {
            const { requestedPermission } = conv.data;
            let address;
            if (requestedPermission === "DEVICE_PRECISE_LOCATION") {
                const { coordinates } = conv.device.location;
                console.log('coordinates are', coordinates);
                if (coordinates && address) {
                    return conv.close(new actions_on_google_1.SimpleResponse(`Your Location details ${address}`));
                }
                else {
                    // Note: Currently, precise locaton only returns lat/lng coordinates on phones and lat/lng coordinates
                    // and a geocoded address on voice-activated speakers.
                    // Coarse location only works on voice-activated speakers.
                    return conv.close("Sorry, I could not figure out where you are.");
                }
            }
        }
        else {
            return conv.close("Sorry, permission denied.");
        }
    });
});
app.listen(port, () => {
    console.log(`Server is running at port: ${port}`);
});
