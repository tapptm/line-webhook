import { Payload, Platforms } from "dialogflow-fulfillment";
import { Line, LineColumns } from "../dto/pointOfInterest.dto";
import { calculateDistance } from "../utils/poiCalculateDistance";
import { Agent } from "../dto/pointOfInterest.dto";
import { carouselPayloads } from "../payloads/carouselPayload";

async function getlocation(agent: Agent) {
  console.log(agent);
  console.log(agent.parameters.location);
  
  /** calculate distance from your current location **/
  const distanceData = await calculateDistance(
    agent.intent, // set your intent name here.
    14.9881753, // set your locations here.
    102.1198264 // set your locations here.
  );

  /** condition to check if radius in 50 km
   * it will return text. if not it will
   * return custom payload. **/
  if (distanceData.length > 0) {
    /** format custom payload for line bot **/
    const payload = carouselPayloads(distanceData);
    console.log(JSON.stringify(payload));

    return agent.add(
      new Payload("LINE" as Platforms, payload, {
        rawPayload: true,
        sendAsMessage: true,
      })
    );
  }

  return agent.add("ไม่พบข้อมูล" + agent.intent + "ในระยะ (100km)");
}

export { getlocation };
