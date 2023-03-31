import { orderByDistance, getDistance } from "geolib";

async function calculateDistance(
  latitude: number,
  longitude: number,
  dataset: Array<any>
) {
  const distanceData = dataset.map((item) => {
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

  /** order by and filter radius in 200 km **/
  const volunteers = orderByDistance(
    { latitude: latitude, longitude: longitude },
    distanceData
  )
    .filter(
      (item: any) => item.distance_meters <= 20000 // meters
    )
    .slice(0, 5); // get fisrt 1 elements in array.

  return volunteers;
}

export { calculateDistance };
