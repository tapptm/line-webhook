import { Payload, Platforms } from "dialogflow-fulfillment";
import { Line, LineColumns } from "../dto/pointOfInterest.dto";
import { calculateDistance } from "../utils/poiCalculateDistance";
import { Agent } from "../dto/pointOfInterest.dto";

async function getlocation(agent: Agent) {
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
    /** format custom payload for line **/
    const columns: LineColumns[] = distanceData.map((distance: any) => {
      return {
        thumbnailImageUrl: distance.image,
        imageBackgroundColor: "#FFFFFF",
        title: distance.name.replace(/(.{40})..+/, "$1…"),
        text: distance.distance,
        actions: [
          {
            type: "uri",
            label: "เปิดแผนที่",
            uri: `http://maps.google.com/maps?z=12&t=m&q=loc:${distance.latitude}+${distance.longitude}`,
          },
        ],
      };
    });

    const payload: Line = {
      line: {
        type: "template",
        altText: "this is a carousel template",
        template: {
          type: "carousel",
          imageAspectRatio: "rectangle",
          imageSize: "cover",
          columns: columns,
        },
      },
    };

    console.log(JSON.stringify(payload));

    return agent.add(
      new Payload("LINE" as Platforms, JSON.parse(JSON.stringify(payload)), {
        rawPayload: true,
        sendAsMessage: true,
      })
    );
  }

  return agent.add("ไม่พบข้อมูล" + agent.intent + "ในระยะ (50km)");
}

export { getlocation };
