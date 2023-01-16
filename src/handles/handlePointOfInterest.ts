import { Payload, Platforms } from "dialogflow-fulfillment";
import { getPoiByGroup } from "../services/PointOfInterest";
import { orderByDistance, findNearest } from "geolib";

async function getATMlocation(agent: {
  UNSPECIFIED: Platforms;
  rawPayload: boolean;
  sendAsMessage: boolean;
  intent: string;
  add: (add: Object) => void;
}) {
  const poi = await getPoiByGroup(agent.intent);
  const volunteers = findNearest(
    { latitude: 14.9881753, longitude: 102.1198264 },
    poi
  );
  console.log(volunteers);

  const payload: Object = {
    line: {
      type: "template",
      altText: "this is a carousel template",
      template: {
        imageSize: "cover",
        columns: [
          {
            actions: [
              {
                label: "สั่งซื้อ",
                data: "action=buy&itemid=111",
                type: "postback",
              },
              {
                label: "เพิ่มลงรถเข็น",
                type: "postback",
                data: "action=add&itemid=111",
              },
              {
                type: "uri",
                label: "รายละเอียด",
                uri: "https://www.google.com/",
              },
            ],
            title: "แผ่นเกม Sword Art Online",
            thumbnailImageUrl:
              "https://1.bp.blogspot.com/-U90M8DyKu7Q/W9EtONMCf6I/AAAAAAAAW_4/7L_jB_Rg9oweu2HKhULNdu9WNefw9zf9wCLcBGAs/s1600/sao-full.jpg",
            text: "แผ่นเกม Sword Art Online",
            imageBackgroundColor: "#FFFFFF",
            defaultAction: {
              label: "รายละเอียด",
              type: "uri",
              uri: "https://www.google.com/",
            },
          },
          {
            thumbnailImageUrl:
              "https://2.bp.blogspot.com/-xAUbzdD07Z8/W9F4070M0JI/AAAAAAAAXAE/67QhUZB4TI4Xyu3GT2-DO0yA5XJtlij-ACLcBGAs/s1600/sao-os.jpg",
            text: "Sword Art Online Ordinal Scale",
            imageBackgroundColor: "#FFFFFF",
            defaultAction: {
              uri: "https://www.google.com/",
              label: "รายละเอียด",
              type: "uri",
            },
            title: "Sword Art Online Ordinal Scale",
            actions: [
              {
                type: "postback",
                data: "action=buy&itemid=111",
                label: "สั่งซื้อ",
              },
              {
                label: "เพิ่มลงรถเข็น",
                data: "action=add&itemid=111",
                type: "postback",
              },
              {
                type: "uri",
                label: "รายละเอียด",
                uri: "https://www.google.com/",
              },
            ],
          },
        ],
        imageAspectRatio: "rectangle",
        type: "carousel",
      },
    },
  };

  agent.add(
    new Payload(agent.UNSPECIFIED, payload, {
      rawPayload: true,
      sendAsMessage: true,
    })
  );
}

export { getATMlocation };
