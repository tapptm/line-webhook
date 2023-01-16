import { Payload, Platforms } from "dialogflow-fulfillment";
import { getPoiByGroup } from "../services/PointOfInterest";
import { orderByDistance, getDistance } from "geolib";
import { imageUrl } from "../configs/urlpath";
import { Line, LineColumns, PointOfInterest } from "../dto/pointOfInterest.dto";

async function calculateDistance(
  intent: string,
  latitude: number,
  longitude: number
) {
  const poidata: PointOfInterest[] = await getPoiByGroup(intent);
  const distancePointofinterest = poidata.map((item) => {
    item.latitude = parseFloat(item.latitude);
    item.longitude = parseFloat(item.longitude);
    item.image = item.image
      ? `${imageUrl}/community/${parseInt(item.community_id)}/poi/${item.image}`
      : null;

    return {
      ...item,
      distance:
        getDistance(
          { latitude: latitude, longitude: longitude },
          { latitude: item.latitude, longitude: item.longitude }
        ) /
          1000 +
        " Km",
    };
  });

  const volunteers = orderByDistance(
    { latitude: latitude, longitude: longitude },
    distancePointofinterest
  );

  return volunteers;
}

async function getATMlocation(agent: {
  UNSPECIFIED: Platforms;
  rawPayload: boolean;
  sendAsMessage: boolean;
  intent: string;
  add: (add: Object) => void;
}) {
  const distanceData = await calculateDistance(
    agent.intent,
    14.9881753,
    102.1198264
  );

  const columns: LineColumns[] = distanceData.map((distance: any) => {
    return {
      thumbnailImageUrl: distance.image ,
      imageBackgroundColor: "#FFFFFF",
      title: distance.name ,
      text: distance.name ,
      actions: [
        {
          type: "uri",
          label: "เปิดแผนที่",
          uri: `http://maps.google.com/maps?z=12&t=m&q=loc:${distance.latitude }+${distance.longitude}`,
        },
      ],
    };
  });

  const payload = {
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

  const payloads = {
    line: {
      type: "template",
      altText: "this is a carousel template",
      template: {
        type: "carousel",
        imageAspectRatio: "rectangle",
        imageSize: "cover",
        columns: [
          {
            thumbnailImageUrl:
              "https://admin.trinitytrip.com/uploads/community/1/poi/poi_081d05881d24d2c0e2e6e83b500d231f_20211012034959000000.jpg",
            imageBackgroundColor: "#FFFFFF",
            title: "ห้ะ",
            text: "ห้ะ",
            actions: [
              {
                type: "uri",
                label: "รายละเอียด",
                uri: "https://www.google.com/",
              },
            ],
          },
        ],
      },
    },
  };

  console.log(JSON.stringify(payload));
  console.log(columns);
  console.log(payloads);
  

  return agent.add(
    new Payload('LINE' as Platforms, JSON.stringify(payload), {
      rawPayload: true,
      sendAsMessage: true,
    })
  );
}

export { getATMlocation };
