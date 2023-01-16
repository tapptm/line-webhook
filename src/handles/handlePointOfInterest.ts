import { Payload, Platforms } from "dialogflow-fulfillment";
import { getPoiByGroup } from "../services/PointOfInterest";

async function getATMlocation(agent: {
  UNSPECIFIED: Platforms;
  rawPayload: boolean;
  sendAsMessage: boolean;
  intent: string;
  add: (add: Object) => void;
}) {
  const poi = await getPoiByGroup(agent.intent);
  console.log(poi);

  const payload: Object = {
    key: "value",
    key2: 2,
  };
  
  agent.add(
    new Payload(agent.UNSPECIFIED, payload, {
      rawPayload: true,
      sendAsMessage: true,
    })
  );
}

export { getATMlocation };
