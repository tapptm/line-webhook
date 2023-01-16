import { Payload, Text, Suggestion, Image, Card } from "dialogflow-fulfillment";

function getLocations(agent: { add: (arg0: string) => void; }) {
  agent.add("HERE! THIS IS YOUR LOCATION.");
}

export { getLocations };
