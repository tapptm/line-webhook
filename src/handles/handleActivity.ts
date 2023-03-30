import { calculateDistance } from "../services/geolib/geolibService";
import {
  audioPayload,
  contentPayload,
  messagePayload,
  carouselPayload,
} from "../payloads/linePayloads";
import { client } from "../configs/linesdk";
import { getActivitysubEN, getActivitysubTH } from "../models/activitySub";
import { Activity } from "../dto/activity.dto";

async function pushMessageActivity(agent: {
  latitude: number;
  longitude: number;
  userId: string;
  intent: string;
}) {
  console.log(agent);
  const activity: Activity[] =
    agent.intent === "language_english"
      ? await getActivitysubEN(null)
      : await getActivitysubTH(null);

  /** calculate distance from your current location **/
  const distanceData: any = await calculateDistance(
    agent.latitude, // set your locations here.
    agent.longitude, // set your locations here.
    activity // dataset from database
  );

  console.log("ACTIVITY_DISTANCE", distanceData);

  /** condition to check if radius in 50 km it will return text. if not it will return custom payload. **/
  if (distanceData.length > 0) {
    /** format custom payload for line bot and push payload image data **/
    const detailPayloadData = await carouselPayload(distanceData, agent.intent);
    await client.pushMessage(agent.userId, detailPayloadData);

    // /* if soundname has not null then send audio and message */
    // if (distanceData[0].soundname !== null) {
    //   /** format custom payload for line bot and push payload audio data **/
    //   const audioPayloadData = await audioPayload(distanceData, agent.intent);
    //   await client.pushMessage(agent.userId, audioPayloadData);

    //   /** format custom payload for line bot and push payload message */
    //   const messagePayloadData = await messagePayload(distanceData, agent.intent);
    //   await client.pushMessage(agent.userId, messagePayloadData);
    // }

    return;
  }

  return client.pushMessage(agent.userId, {
    type: "text",
    text: "น้องชบาไม่พบข้อมูลจุดท่องเที่ยวในระยะ (200km) ค่ะ",
  });
}

async function pushMessagePoint(agent: {
  latitude: number;
  longitude: number;
  userId: string;
  intent: string;
  point_id: number;
}) {
  console.log(agent);
  const activity: Activity[] =
    agent.intent === "language_english"
      ? await getActivitysubEN(agent.point_id)
      : await getActivitysubTH(agent.point_id);

  console.log(activity);

  if (agent.latitude != 0) {
    /** calculate distance from your current location **/
    const distanceData: any = await calculateDistance(
      agent.latitude, // set your locations here.
      agent.longitude, // set your locations here.
      activity // dataset from database
    );

    /** condition to check if radius in 50 km it will return text. if not it will return custom payload. **/
    if (distanceData.length > 0) {
      /** format custom payload for line bot and push payload image data **/
      const detailPayloadData = await contentPayload(
        distanceData,
        agent.intent,
        1
      );
      await client.pushMessage(agent.userId, detailPayloadData);

      /* if soundname has not null then send audio and message */
      if (distanceData[0].soundname !== null) {
        /** format custom payload for line bot and push payload audio data **/
        const audioPayloadData = await audioPayload(distanceData, agent.intent);
        await client.pushMessage(agent.userId, audioPayloadData);

        /** format custom payload for line bot and push payload message */
        const messagePayloadData = await messagePayload(
          distanceData,
          agent.intent
        );
        await client.pushMessage(agent.userId, messagePayloadData);
      }

      return;
    }
  } else {
    /** condition to check if radius in 50 km it will return text. if not it will return custom payload. **/
    if (activity.length > 0) {
      /** format custom payload for line bot and push payload image data **/
      const detailPayloadData = await contentPayload(activity, agent.intent,agent.latitude);
      await client.pushMessage(agent.userId, detailPayloadData);

      /* if soundname has not null then send audio and message */
      if (activity[0].soundname !== null) {
        /** format custom payload for line bot and push payload audio data **/
        const audioPayloadData = await audioPayload(activity, agent.intent);
        await client.pushMessage(agent.userId, audioPayloadData);

        /** format custom payload for line bot and push payload message */
        const messagePayloadData = await messagePayload(activity, agent.intent);
        await client.pushMessage(agent.userId, messagePayloadData);
      }

      return;
    }
  }

  return client.pushMessage(agent.userId, {
    type: "text",
    text: "น้องชบาไม่พบข้อมูลจุดท่องเที่ยวในระยะ (200km) ค่ะ",
  });
}

export { pushMessageActivity, pushMessagePoint };
