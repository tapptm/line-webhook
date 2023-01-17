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

    const distance = getDistance(
      { latitude: latitude, longitude: longitude },
      { latitude: item.latitude, longitude: item.longitude }
    );

    return {
      ...item,
      distance:
        distance >= 1000
          ? `(${(distance / 1000).toFixed(2)} กิโลเมตร)`
          : `(${distance.toFixed(0)} เมตร)`,
      distance_meters: distance,
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
  /** calculate distance from current location **/
  const distanceData = await calculateDistance(
    agent.intent,
    14.9881753,
    102.1198264
  );

  /** filter distance 50 km **/
  const filterInRadius = distanceData.filter(
    (item: any) => item.distance_meters <= 50000
  );

  /** format custom payload for line **/
  const columns: LineColumns[] = filterInRadius.map((distance: any) => {
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

  /** condition to check in radius 50 km and return it. **/
  if (filterInRadius.length === 0) {
    return agent.add("ไม่พบข้อมูล" + agent.intent + "ในระยะ(50km) ที่ต้องการ");
  } else {
    return agent.add(
      new Payload("LINE" as Platforms, JSON.parse(JSON.stringify(payload)), {
        rawPayload: true,
        sendAsMessage: true,
      })
    );
  }
}

export { getATMlocation };
