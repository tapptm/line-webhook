import pool from "../configs/connectiondb";

async function getPoiByGroup(intent: String) {
  const client = await pool.connect();
  const sql = `SELECT   community_id, 
                        poi_id as poiid, 
                        poi_name as name, 
                        poi_detail as detail, 
                        poi_telephone as tel,
                        poi_website as website, 
                        poi_image_cover as image, 
                        poi_latitude as latitude, 
                        poi_longitude as longitude  
                FROM poi 
                LEFT JOIN poi_group ON poi_group.poi_group_id = poi.poi_group_id
                WHERE poi_group.poi_group_name ='${intent}';`;
  const { rows } = await client.query(sql);
  client.release();
  return rows;
}

export { getPoiByGroup };
