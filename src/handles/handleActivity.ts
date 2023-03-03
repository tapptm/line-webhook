import { calculateDistance } from "../services/geolib/geolibService";
import { carouselPayload, audioPayload } from "../payloads/linePayloads";
import { client as clientsdk } from "../configs/linesdk";
import { getActivitysubTH } from "../models/activitySub";
import { getAudioDurationInSeconds } from "get-audio-duration";
import { Activity } from "../dto/activity.dto";
import { audioUrl } from "../configs/urlpath";
async function pushMessageActivityTH(agent: {
  // intent: any;
  latitude: number;
  longitude: number;
  userId: string;
}) {
  console.log(agent);
  const activity: Activity[] = await getActivitysubTH();

  /** calculate distance from your current location **/
  const distanceData = await calculateDistance(
    agent.latitude, // set your locations here.
    agent.longitude, // set your locations here.
    activity
  );

  console.log("ACTIVITY_DISTANCE", distanceData);

  /** condition to check if radius in 50 km
   * it will return text. if not it will
   * return custom payload. **/
  if (distanceData.length > 0) {
    // const duration = await getAudioDurationInSeconds(
    //   `../assets/audios/audio_example.mp3`
    // );

    /** format custom payload for line bot **/
    const carouselPayloadData = carouselPayload(distanceData);
    const audioPayloadData = audioPayload(
      `${audioUrl}/audio_example.mp3`,
      20000
    );

    console.log(JSON.stringify(carouselPayload));

    /** push payload image data */
    clientsdk.pushMessage(agent.userId, carouselPayloadData);

    /** push payload audio data */
    clientsdk.pushMessage(agent.userId, audioPayloadData);
    return;
  }

  return clientsdk.pushMessage(agent.userId, {
    type: "text",
    text: "น้องชบาไม่พบข้อมูลจุดท่องเที่ยวในระยะ (200km) ค่ะ",
  });
}

export { pushMessageActivityTH };
