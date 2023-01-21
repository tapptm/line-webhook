import { calculateDistance } from "../services/geolib/geolibService";
import { carouselPayloads } from "../payloads/carouselPayload";
import { client as clientsdk } from "../configs/linesdk";
import { getHotels } from "../models/hotel";
import { Hotel } from "../dto/hotel.dto";

async function getlocationHotels(agent: {
  intent: any;
  latitude: number;
  longitude: number;
  userId: string;
}) {
  console.log(agent);
  const hotel: Hotel[] = await getHotels();
  /** calculate distance from your current location **/
  const distanceData = await calculateDistance(
    agent.latitude, // set your locations here.
    agent.longitude, // set your locations here.
    hotel
  );

  console.log("HOTEL_DISTANCE", distanceData);

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
    text: "ไม่พบข้อมูล" + agent.intent + "ในระยะ (200km)",
  });
}

export { getlocationHotels };
