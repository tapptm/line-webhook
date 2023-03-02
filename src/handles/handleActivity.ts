import { calculateDistance } from "../services/geolib/geolibService";
import { carouselPayloads } from "../payloads/carouselPayload";
import { client as clientsdk } from "../configs/linesdk";
import { getActivity, getActivitysubTH } from "../models/activity";
import { Activity } from "../dto/activity.dto";

async function getlocationActivitys(agent: {
  // intent: any;
  latitude: number;
  longitude: number;
  userId: string;
}) {
  console.log(agent);
  const activity: Activity[] = await getActivitysubTH();

  console.log(activity);

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
    /** format custom payload for line bot **/
    const payload = carouselPayloads(distanceData);
    console.log(JSON.stringify(payload));

    clientsdk.pushMessage(agent.userId, payload);
    clientsdk.pushMessage(
      agent.userId,
      JSON.parse(
        JSON.stringify({
          type: "audio",
          duration: 27000,
          originalContentUrl:
            "http://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3",
        })
      )
    );
  }

  return clientsdk.pushMessage(agent.userId, {
    type: "text",
    text: "น้องชบาไม่พบข้อมูลจุดท่องเที่ยวในระยะ (200km) ค่ะ",
  });
}

export { getlocationActivitys };
