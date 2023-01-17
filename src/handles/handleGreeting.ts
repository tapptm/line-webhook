import { Payload, Text, Suggestion, Image, Card } from "dialogflow-fulfillment";
import { dialogflow, Permission, SimpleResponse } from "actions-on-google";

async function getGreeting(agent: { conv: any; add: (add: string) => void }) {
  const conv = agent.conv();
  conv.ask(
    new Permission({
      context: "To locate you",
      permissions: "DEVICE_PRECISE_LOCATION",
    })
  );
  // agent.add("Hello I am Webhook demo How are you...");
}

export { getGreeting };
