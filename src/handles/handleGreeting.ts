import { Payload, Text, Suggestion, Image, Card } from "dialogflow-fulfillment";

async function getGreeting(agent: { add: (add: string) => void }) {
  agent.add("Hello I am Webhook demo How are you...");
}

export { getGreeting };
