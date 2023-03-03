import { calculateDistance } from "../services/geolib/geolibService";
import { audioPayload, contentPayload } from "../payloads/linePayloads";
import { client as clientsdk } from "../configs/linesdk";
import { getActivitysubTH } from "../models/activitySub";
import { getAudioDurationInSeconds } from "get-audio-duration";
import { Activity } from "../dto/activity.dto";

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
    // const carouselPayloadData = carouselPayload(distanceData);
    const detailPayloadData = contentPayload(distanceData);
    const audioPayloadData = audioPayload(distanceData);

    console.log(JSON.stringify(detailPayloadData));

    /** push payload image data */
    clientsdk.pushMessage(agent.userId, detailPayloadData);

    clientsdk.pushMessage(agent.userId, {
      type: "text",
      text: "พี่ๆ สามารถฟังเสียงบรรยาย เกี่ยวกับ ...",
    });

    /** push payload audio data */
    setTimeout(() => {
      clientsdk.pushMessage(agent.userId, audioPayloadData);
    }, 2000);

    return;
  }

  return clientsdk.pushMessage(agent.userId, {
    type: "text",
    text: "น้องชบาไม่พบข้อมูลจุดท่องเที่ยวในระยะ (200km) ค่ะ",
  });
}

export { pushMessageActivityTH };
