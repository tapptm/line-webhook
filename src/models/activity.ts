import pool from "../configs/database";
import { imageUrl } from "../configs/urlpath";

async function getActivity() {
  const client = await pool.connect();
  const sql = `SELECT   acitity_name as name, 
                        acitity_detail as detail,
                        acitity_latitude as latitude,
                        acitity_longitude as longitude,
                        acitity_image_cover as image,
                        community_id
               FROM activity;`;
  const { rows } = await client.query(sql);
  client.release();
  rows.map((item) => {
    item.latitude = parseFloat(item.latitude);
    item.longitude = parseFloat(item.longitude);
    item.image = item.image
      ? `${imageUrl}/community/${parseInt(item.community_id)}/activity/${
          item.image
        }`
      : null;
  });

  return rows;
}

export { getActivity };
