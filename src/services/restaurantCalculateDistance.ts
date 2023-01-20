import { getRestaurant } from "../models/restaurant";
import { orderByDistance, getDistance } from "geolib";
import { imageUrl } from "../configs/urlpath";
import { Restaurant } from "../dto/restaurant.dto";

async function calculateDistance(
  latitude: number,
  longitude: number
) {
  let restaurant: Restaurant[] = await getRestaurant()
  const distanceRestaurant = restaurant.map((item) => {
    item.latitude = parseFloat(item.latitude);
    item.longitude = parseFloat(item.longitude);
    item.image = item.image
      ? `${imageUrl}/community/${parseInt(item.community_id)}/restaurant/${item.image}`
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

  /** order by and filter radius in 100 km **/
  const volunteers = orderByDistance(
    { latitude: latitude, longitude: longitude },
    distanceRestaurant
  )
    .filter(
      (item: any) => item.distance_meters <= 200000 // meters
    )
    .slice(0, 3);

  return volunteers;
}

export { calculateDistance };
