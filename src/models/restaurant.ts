import pool from "../configs/database";

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
  return rows;
}

export { getRestaurant };
