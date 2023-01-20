import pool from "../configs/database";

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
  return rows;
}

export { getHotels };
