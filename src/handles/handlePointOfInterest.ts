import { calculateDistance } from "../services/geolib/geolibService";
import { carouselPayloads } from "../payloads/carouselPayload";
import { client as clientsdk } from "../configs/linesdk";
import { getPoiByGroup } from "../models/PointOfInterest";
import { PointOfInterest } from "../dto/pointOfInterest.dto";

async function getlocationPointOfInterest(agent: {
  intent: any;
  latitude: number;
  longitude: number;
  userId: string;
}) {
  console.log(agent);
  let pointOfInterest: PointOfInterest[] = [];
  if (agent.intent === "โรงพยาบาล") {
    const health: PointOfInterest[] = await getPoiByGroup(
      "โรงพยาบาล",
      "ร้านขายยา",
      "โรงพยาบาลส่งเสริมสุขภาพตำบล"
    );
    pointOfInterest = [...health];
  } else if (agent.intent === "ร้านค้า") {
    const stores: PointOfInterest[] = await getPoiByGroup(
      "ร้านขายของชำ",
      "ร้านขายของฝาก",
      "ร้านค้าวิสาหกิจชุมชน"
    );
    pointOfInterest = [...stores];
  } else if (agent.intent === "ปั้มน้ำมัน") {
    const fuelstation: PointOfInterest[] = await getPoiByGroup(
      "ปตท",
      "ปั้มน้ำมัน",
      ""
    );
    pointOfInterest = [...fuelstation];
  } else if (agent.intent === "ธนาคาร") {
    const banks: PointOfInterest[] = await getPoiByGroup(
      "ตู้กดเงินสด",
      "ธนาคาร",
      ""
    );
    pointOfInterest = [...banks];
  } else {
    pointOfInterest = [...(await getPoiByGroup(agent.intent, "", ""))];
  }

  /** calculate distance from your current location **/
  const distanceData = await calculateDistance(
    agent.latitude, // set your locations here.
    agent.longitude, // set your locations here.
    pointOfInterest
  );

  console.log("POI_DISTANCE", distanceData);

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

export { getlocationPointOfInterest };
