import { getPoiByGroup } from "../services/PointOfInterest";
import { orderByDistance, getDistance } from "geolib";
import { imageUrl } from "../configs/urlpath";
import { PointOfInterest } from "../dto/pointOfInterest.dto";

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

  /** order by and filter radius in 50 km **/
  const volunteers = orderByDistance(
    { latitude: latitude, longitude: longitude },
    distancePointofinterest
  ).filter(
    (item: any) => item.distance_meters <= 50000 // meters
  );

  return volunteers;
}

export { calculateDistance };
