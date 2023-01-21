import pool from "../configs/database";
import { imageUrl } from "../configs/urlpath";

async function getRestaurant() {
  const client = await pool.connect();
  const sql = `SELECT   restaurant_name as name, 
                        restaurant_detail as detail,
                        restaurant_latitude as latitude,
                        restaurant_longitude as longitude,
                        restaurant_image_cover as image,
                        community_id
               FROM restaurant;`;
  const { rows } = await client.query(sql);
  client.release();

  rows.map((item) => {
    item.latitude = parseFloat(item.latitude);
    item.longitude = parseFloat(item.longitude);
    item.image = item.image
      ? `${imageUrl}/community/${parseInt(item.community_id)}/restaurant/${
          item.image
        }`
      : null;
  });

  return rows;
}

export { getRestaurant };
