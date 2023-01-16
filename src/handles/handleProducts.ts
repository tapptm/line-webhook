import { Payload, Text, Suggestion, Image, Card } from "dialogflow-fulfillment";

function getProducts(agent: { add: (arg0: string) => void }) {
  agent.add("HERE! THIS IS YOUR PRODUCT.");
}

export { getProducts };
