import pool from "../configs/database";
import { imageUrl } from "../configs/urlpath";

async function getHotels() {
  const client = await pool.connect();
  const sql = `SELECT   hotel_name as name, 
                        hotel_detail as detail,
                        hotel_latitude as latitude,
                        hotel_longitude as longitude,
                        hotel_image_cover as image,
                        community_id
               FROM hotel;`;
  const { rows } = await client.query(sql);
  client.release();
  rows.map((item) => {
    item.latitude = parseFloat(item.latitude);
    item.longitude = parseFloat(item.longitude);
    item.image = item.image
      ? `${imageUrl}/community/${parseInt(item.community_id)}/hotel/${
          item.image
        }`
      : null;
  });

  return rows;
}

export { getHotels };
