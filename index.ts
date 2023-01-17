import express, { Express, Request, Response } from "express";
import { WebhookClient } from "dialogflow-fulfillment";
import { getGreeting } from "./src/handles/handleGreeting";
import { getlocation } from "./src/handles/handlePointOfInterest";
import { dialogflow, Permission, SimpleResponse } from "actions-on-google";
import dotenv from "dotenv";

dotenv.config();
const dlf = dialogflow();
const app: Express = express();
const port = process.env.NODE_PORT || 4050;

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

  dlf.intent("locat", (conv: any) => {
    conv.data.requestedPermission = "DEVICE_PRECISE_LOCATION";
    conv.ask(new SimpleResponse('Welcome to location tracker'));
    return conv.ask(
      new Permission({
        context: "to locate you",
        permissions: conv.data.requestedPermission
      })
    );
  })

  dlf.intent("get_current_location", (conv:any, params, permissionGranted) => {
    if (permissionGranted) {
      const { requestedPermission } = conv.data;
      let address;
      if (requestedPermission === "DEVICE_PRECISE_LOCATION") {
        const { coordinates } = conv.device.location;
        console.log('coordinates are', coordinates);
  
        if (coordinates && address) {
          return conv.close(new SimpleResponse(`Your Location details ${address}`));
        } else {
          // Note: Currently, precise locaton only returns lat/lng coordinates on phones and lat/lng coordinates
          // and a geocoded address on voice-activated speakers.
          // Coarse location only works on voice-activated speakers.
          return conv.close("Sorry, I could not figure out where you are.");
        }
      }
    } else {
      return conv.close("Sorry, permission denied.");
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running at port: ${port}`);
});
