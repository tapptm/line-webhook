import { Line, LineColumns } from "../dto/pointOfInterest.dto";
import { calculateDistance } from "../services/activityCalculateDistance";
import { carouselPayloads } from "../payloads/carouselPayload";
import { client as clientsdk } from "../configs/linesdk";

async function getlocationHotels(agent: {
  intent: any;
  latitude: number;
  longitude: number;
  userId: string;
}) {
  console.log(agent);
  /** calculate distance from your current location **/
  const distanceData = await calculateDistance(
    agent.latitude, // set your locations here.
    agent.longitude // set your locations here.
  );

  /** condition to check if radius in 50 km
   * it will return text. if not it will
   * return custom payload. **/
  if (distanceData.length > 0) {
    /** format custom payload for line bot **/
    const payload = carouselPayloads(distanceData);
    console.log(JSON.stringify(payload));

    return clientsdk.pushMessage(agent.userId, payload);
  }

  return clientsdk.pushMessage(agent.userId, {
    type: "text",
    text: "ไม่พบข้อมูล" + agent.intent + "ในระยะ (100km)",
  });
}

export { getlocationHotels };
