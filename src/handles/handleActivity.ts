import { calculateDistance } from "../services/geolib/geolibService";
import {
  audioPayload,
  contentPayload,
  messagePayload,
} from "../payloads/linePayloads";
import { client } from "../configs/linesdk";
import { getActivitysubEN, getActivitysubTH } from "../models/activitySub";
import { Activity } from "../dto/activity.dto";
import LanguageDetect from "languagedetect";

async function pushMessageActivity(agent: {
  latitude: number;
  longitude: number;
  userId: string;
  message: string;
}) {
  console.log(agent);
  const lngDetector = new LanguageDetect();
  const lngList = lngDetector.detect(agent.message);
  console.log('LanguageList', lngList);

  const activity: Activity[] =
    lngList[0][0] === "english"
      ? await getActivitysubEN()
      : await getActivitysubTH();

  /** calculate distance from your current location **/
  const distanceData = await calculateDistance(
    agent.latitude, // set your locations here.
    agent.longitude, // set your locations here.
    activity
  );

  console.log("ACTIVITY_DISTANCE", distanceData);

  /** condition to check if radius in 50 km it will return text. if not it will return custom payload. **/
  if (distanceData.length > 0) {
    /** format custom payload for line bot **/
    const detailPayloadData = await contentPayload(distanceData, lngList[0][0]);
    const audioPayloadData = await audioPayload(distanceData,);
    const messagePayloadData = await messagePayload(distanceData, lngList[0][0]);

    /** push payload image data */
    await client.pushMessage(agent.userId, detailPayloadData);

    /** push payload audio data and message */
    await client.pushMessage(agent.userId, messagePayloadData);
    await client.pushMessage(agent.userId, audioPayloadData);
    return;
  }

  return client.pushMessage(agent.userId, {
    type: "text",
    text: "น้องชบาไม่พบข้อมูลจุดท่องเที่ยวในระยะ (200km) ค่ะ",
  });
}

export { pushMessageActivity };
