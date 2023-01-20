import pool from "../configs/database";

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
  return rows;
}

export { getActivity };
