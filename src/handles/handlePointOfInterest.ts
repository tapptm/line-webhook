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
    const contents = distanceData.map((distance: any) => {
      return {
        type: "bubble",
        size: "micro",
        hero: {
          type: "image",
          url: distance.image,
          size: "full",
          aspectMode: "cover",
          aspectRatio: "320:213",
        },
        body: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: distance.name.replace(/(.{40})..+/, "$1…"),
              weight: "bold",
              size: "sm",
              wrap: true,
            },
            {
              type: "box",
              layout: "baseline",
              contents: [
                {
                  type: "icon",
                  size: "xs",
                  url: "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png",
                },
                {
                  type: "icon",
                  size: "xs",
                  url: "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png",
                },
                {
                  type: "icon",
                  size: "xs",
                  url: "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png",
                },
                {
                  type: "icon",
                  size: "xs",
                  url: "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png",
                },
                {
                  type: "icon",
                  size: "xs",
                  url: "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gray_star_28.png",
                },
                {
                  type: "text",
                  text: "4.0",
                  size: "xs",
                  color: "#8c8c8c",
                  margin: "md",
                },
              ],
            },
            {
              type: "box",
              layout: "vertical",
              contents: [
                {
                  type: "box",
                  layout: "baseline",
                  spacing: "sm",
                  contents: [
                    {
                      type: "text",
                      text: distance.distance,
                      wrap: true,
                      color: "#8c8c8c",
                      size: "xs",
                    },
                  ],
                },
              ],
            },
          ],
          spacing: "sm",
          paddingAll: "13px",
        },
        footer: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "separator",
            },
            {
              type: "button",
              action: {
                type: "uri",
                label: "เปิดแผนที่",
                uri: `http://maps.google.com/maps?z=12&t=m&q=loc:${distance.latitude}+${distance.longitude}`,
              },
            },
          ],
        },
      };
    });

    const payload = {
      line: {
        type: "flex",
        altText: "Flex Message",
        contents: {
          type: "carousel",
          contents: contents,
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
